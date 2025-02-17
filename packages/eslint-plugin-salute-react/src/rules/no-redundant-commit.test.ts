import { RuleTester } from "@typescript-eslint/rule-tester";
import { describe, it } from "vitest";
import rule from "./no-redundant-commit.js";

RuleTester.afterAll = () => {};
RuleTester.it = it;
RuleTester.describe = describe;

const ruleTester = new RuleTester({
  languageOptions: {
    sourceType: "module",
    ecmaVersion: 2018,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

const tests = {
  valid: [
    {
      code: ` 
      function MyComponent() {
        const [didMount, setDidMount] = useState(false);
      
        useEffect(() => {
          setTimeout(() => setDidMount(true), 100);
        }, []);
      
        if (!didMount) {
          return <Loader />;
        }
        return <Loader />;
      }
      `,
    },
    {
      code: `
      function MyComponent() {
        const [constant] = useState(false);
        return <Component />;
      }
      `,
    },
    {
      code: ` 
      function MyComponent() {
        const [data, setData] = useState('');
      
        useEffect(() => {
          async function fetchMyAPI() {
            let url = 'http://something';
            let config = {};
            const response = await myFetch(url);
            setData(response)
          };
          fetchMyAPI();
        }, []);
      }
      `,
    },
    {
      code: ` 
      // https://www.robinwieruch.de/react-hooks-fetch-data/
      import React, { useState, useEffect } from 'react';
      import axios from 'axios';
      
      function App() {
        const [data, setData] = useState({ hits: [] });
      
        useEffect(async () => {
          const result = await axios(
            'https://hn.algolia.com/api/v1/search?query=redux',
          );
      
          setData(result.data);
        });
      }      
      `,
    },
    {
      code: ` 
      import React, { useState, useEffect } from 'react';
      import axios from 'axios';
      
      function App() {
        const [data, setData] = useState({ hits: [] });
      
        useEffect(() => {
          axios(
            'https://hn.algolia.com/api/v1/search?query=redux',
          ).then((result)=> setData(result.data))
        });
      }      
      `,
    },
    {
      code: ` 
      import React, { useState, useEffect } from 'react';
      import axios from 'axios';
      
      function App() {
        const [data, setData] = useState({ hits: [] });
      
        useEffect(() => {
          axios(
            'https://hn.algolia.com/api/v1/search?query=redux',
          ).then(result=> result).catch((result)=> setData(result.data))
        });
      }      
      `,
    },
    {
      code: ` 
      import React, { useState, useEffect } from 'react';      
      function App() {
        const [data, setData] = useState({ hits: [] });
      
        useEffect(() => {
          button.addEventListener('click', () => {
            setData(data)
          })
        });
      }      
      `,
    },
    {
      code: ` 
      import React, { useState, useEffect } from 'react';      
      function App() {
        const [data, setData] = useState({ hits: [] });
          useEffect(() => {
            function onSubmit (data) {
              setData(data)
            }
            button.addEventListener('click', onSubmit);
        });
      }      
      `,
    },
  ],
  invalid: [
    {
      code: ` 
      function MyComponent() {
        const [didMount, setDidMount] = useState(false);
        useEffect(()=>setDidMount(true), []);
        return <Page/>
      }
      `,
      errors: [{ messageId: "redundantCommit" as const }],
    },
    {
      code: ` 
      function MyComponent() {
        const [didMount, setDidMount] = useState(false);
      
        useEffect(() => {
          setDidMount(true);
        }, []);
      
        if (!didMount) {
          return <Loader/>
        } 
        return <Page/>
      }
      `,
      errors: [{ messageId: "redundantCommit" as const }],
    },
    {
      code: ` 
      function MyComponent() {
        const [didMount, setDidMount] = useState(false);
        const [count, setCount] = useState(0);
      
        useEffect(() => {
          setTimeout(() => setDidMount(true), 100);
          setCount(1);
        }, []);
      
        if (!didMount) {
          return <Loader />;
        }
        return <Loader />;
      }
      `,
      errors: [{ messageId: "redundantCommit" as const }],
    },
    {
      code: ` 
      const MyComponent = () => {
        const [didMount, setDidMount] = useState(false);
        const [count, setCount] = useState(0);
      
        useEffect(() => {
          setTimeout(() => setDidMount(true), 100);
          setCount(1);
        }, []);
      
        if (!didMount) {
          return <Loader />;
        }
        return <Loader />;
      }
      `,
      errors: [{ messageId: "redundantCommit" as const }],
    },
    {
      code: `
            const MyComponent = () => {
              const [data, setData] = useState([]);
              useEffect(() => {
                const fn = (data) => {
                  setData(data);
                };
                fn();
              });
              return <Loader />;
            };
      `,
      errors: [{ messageId: "redundantCommit" as const }],
    },
    {
      code: `
            const MyComponent = () => {
              const [data, setData] = useState([]);
              const fn = (data) => {
                setData(data);
              };
              useEffect(() => {
                fn();
              });
              return <Loader />;
            };
      `,
      errors: [{ messageId: "redundantCommit" as const }],
    },
  ],
};

ruleTester.run("no-redundant-commit", rule, tests);
