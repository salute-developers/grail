import noMemoizedPrimitives from "./no-memoized-primitives.js";
import noModifyingRefOnRender from "./no-modifying-ref-on-render.js";
import noRedundantCommit from "./no-redundant-commit.js";
import preferLazyStateInitialization from "./prefer-lazy-state-initialization.js";

export const rules = {
  "no-memoized-primitives": noMemoizedPrimitives,
  "no-modifying-ref-on-render": noModifyingRefOnRender,
  "no-redundant-commit": noRedundantCommit,
  "prefer-lazy-state-initialization": preferLazyStateInitialization,
};
