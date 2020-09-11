# Hypernova React JS Calculator

This is a calculator application I'm building as a learning experience for TypeScript and React.

#### How it works:
1. The application has several properties stored in `Calculator` that track the calculator's inputs
2. `Calculator` renders in HTML: render calculator body, display, and call some functions to render the buttons and display text
3. Each button calls a function to add values, delete values or calculate.
4. Depends on the context, if it's solely for editing, `CalcEdit` will be called from the function in `Calculator`
5. `CalcLogic` will be called if `CalcEdit` or `Calculator` require to preform to run input as equations (no evals used!)

#### What I have learned:
- Understanding the gist of React and TypeScript
- Understanding development environment like IDE, npm, debugging, unit testing, documentations, etc.
- Improvements on code organization and readability
- Improvements on logics/problem solving
