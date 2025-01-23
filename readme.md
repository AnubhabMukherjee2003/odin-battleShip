# WEBPACK_TEMPLATE

## what I Have Done
```sh
npm install --save-dev webpack webpack-cli html-webpack-plugin style-loader css-loader html-loader webpack-dev-server
```
and the config files 
## What You Have to
1. Clone the repository:
     ```sh
     git clone https://github.com/AnubhabMukherjee2003/webpack-template
     cd webpack-template
     ```

2. Install dependencies:
     ```sh
     npm i
     ```

3. Build the project:
     ```sh
     npm run build
     ```

4. Start the development server:
     ```sh
     npm run dev
     ```
5. for deploy
     create new branch first time.(You only need to do this the first time you deploy. The rest of the steps should be done every time you deploy or redeploy your project.)
     ```sh
     git branch gh-pages
     ```
     to change branch and sync your changes from main so that you’re ready to deploy.
     ```sh
     git checkout gh-pages && git merge main --no-edit
     ```
     bundle into dist
     ```sh
     npm run build
     ```
     to commit the dist folder 
     ```sh
     git add dist -f && git commit -m "Deployment commit"
     ```
     deploy 
     ```sh
     npm run deploy
     ```
     back to main
     ```sh
     git checkout main

     ```
## Project Structure
```
webpack-template/
├── dist/
├── node_modules/
├── src/
│   ├(YOUR CODE HERE)
├── .gitignore
├── package.json
├── webpack.config.js
└── README.md
```