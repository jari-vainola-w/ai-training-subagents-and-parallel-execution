### Subagents and parallel execution

You will build two things in this exercise: a reusable code review agent that you can carry into future projects, and a multi-agent implementation of a real feature using a pre-written plan. The lab repo is an extension of the Module 9 expense tracker — you already know the codebase, so the focus stays on the multi-agent workflow.

By the end, you will have run a parallel agent execution, navigated the shared-file problem it can cause, and used your own agent to review the result.

## Exercise

> **Tip:** For the agent definition step, a more capable model helps it produce better review criteria. For implementation tasks, you can use a faster model — Claude Code will use it for the subagents it spawns. If you are unsure, module 4's theory section covers model selection in more detail.

### Step 1 — Explore the starting codebase

<!-- github-only -->
Clone your copy of the repo. Install dependencies, seed the sample data, and start the app:
<!-- /github-only -->
<!-- mcp-only
Install dependencies, seed the sample data, and start the app:
-->

```
npm install
npm run seed
npm run dev
```

Open the app at http://localhost:5173. You will see the full Module 9 feature set: expense tracking with budget categories and a spending dashboard. The seed script has loaded sample categories and expenses so the report view will show real data once you implement it.

Read `docs/plan.md`. This is the pre-written implementation plan for the monthly spending report feature. Before moving on, read every step and ask yourself: which tasks are independent of each other, and which depend on an earlier step finishing first?

---

### Step 2 — Define a code review agent

Before running the multi-agent implementation, build the tool you will use to review its output.

Create a code review agent at `.claude/agents/code-review.md`. The agent should perform a structured review covering correctness, error handling, security, and test coverage. Use the agent definition structure from the module theory section "How to define a pre-defined subagent".

Adapt the review criteria to this codebase. If there are conventions in `.claude/CLAUDE.md`, include them in the agent's instructions.

Test the agent on existing code before moving on:

```
Using the code-review agent, review backend/src/routes/categories.ts
```

Read the findings. If the review is too generic or misses things you would catch yourself, update the agent definition and run it again until you are satisfied.

---

### Step 3 — Run the multi-agent implementation

Open a new Claude Code session and paste the following prompt, replacing the placeholder with the contents of `docs/plan.md`:

```
I have an implementation plan. Please assign each independent task to a parallel 
subagent and coordinate their execution.

Plan:
[paste the contents of docs/plan.md here]

Before spawning agents: identify which tasks are independent (can run in parallel) 
and which have dependencies (must run in sequence). State your grouping before 
starting. Run dependent tasks in order. Run independent tasks in parallel.
```

Watch how Claude Code groups the tasks. Note which ones it runs in parallel and which it treats as sequential prerequisites.

---

### Step 4 — Handle the shared file

Look at `docs/plan.md`. Steps 3 and 4 of the plan both write to `backend/src/routes/reports.ts`. If Claude Code ran those two tasks in parallel, check whether the output is consistent. If it ran them sequentially, note why that was the right call.

This is the shared-file scenario from the module theory section "Git worktree: separate workspaces for parallel agents": tasks that look independent but share a file. Decide whether the implementation needs any corrections and fix them if so.

---

### Step 5 — Review with your agent

Run the code review agent on the files produced by the multi-agent implementation:

```
Using the code-review agent, review the following files:
- backend/src/utils/report.ts
- backend/src/routes/reports.ts
- frontend/src/components/ReportView.tsx
```

Read the findings. For each critical or important issue raised, decide: fix it now, note it for later, or dismiss it. You do not have to fix everything — use your own judgment.

---

### Step 6 — Verify

<!-- github-only -->
Run the checks locally before pushing:
<!-- /github-only -->
<!-- mcp-only
Run the checks locally:
-->

```
cd backend && npx tsc --noEmit && npm test
cd ../frontend && npx tsc --noEmit
```

<!-- github-only -->
Fix any errors before pushing. If the multi-agent run missed a step or produced incomplete code, add or correct it now.
<!-- /github-only -->
<!-- mcp-only
Fix any errors. If the multi-agent run missed a step or produced incomplete code, add or correct it now.
-->

---

### Step 7 — Reflect

Write your answers to these questions in `docs/reflection.md`:

- Which tasks did Claude Code run in parallel, and which did it treat as sequential? Was the grouping what you expected?
- How did Claude Code handle Steps 3 and 4 sharing a file? Did you have to intervene?
- What did your code review agent catch in the multi-agent output that you would not have noticed without it?
- Looking back at the Module 9 workflow: which steps would you now turn into pre-defined agents for your team? Name at least two.
- Estimate how long this feature would have taken to implement without using parallel subagents.

<!-- github-only -->
### Automated Checks

The CI pipeline will verify:

1. Typecheck passes (backend and frontend)
2. `npm test` passes (backend unit tests including the new report tests)
3. `backend/src/utils/report.ts` exists and is non-empty
4. `backend/src/routes/reports.ts` exists and is non-empty
5. `frontend/src/components/ReportView.tsx` exists and is non-empty
6. `.claude/agents/` contains at least one `.md` file (your agent from Step 2)
7. `docs/reflection.md` exists and is non-empty

Commit and push when the local checks pass. The CI check runs on every push.

<details>
<summary>Having trouble? 🤷</summary><br/>

* If Claude Code does not group tasks the way you expected, read through the plan again and check whether the dependencies between steps are clearly stated. Rewrite the relevant step descriptions to make dependencies explicit, then run the prompt again.
* If two parallel agents both wrote to `reports.ts` and the result is inconsistent, ask Claude to reconcile the two implementations into one file, keeping the better version of any duplicated logic.
* If `npx tsc --noEmit` fails, paste the error output into a new session with the relevant file open and ask Claude to fix it.
* If `npm test` fails, paste the error output into a session and ask Claude to fix the test or the implementation. Address one failure at a time so you can tell what the error was.
* If nothing happens for a while after committing your code, or if the tests do not pass, check the [Actions](../actions) tab to see what went wrong.
* If you are still having trouble, ask for help in the course support channel.

</details>

---

<img alt="Amin 2.0" src="../images/amin2_smile.png" align="right" height="125px" />

You have built a reusable agent and run a real parallel implementation. The reflection questions are the most important part — take them seriously before pushing.
<!-- /github-only -->
<!-- mcp-only
When you are done, ask me to check your solution.
-->
