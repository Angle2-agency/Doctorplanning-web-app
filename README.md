# Lutaplanning React Project

### Description: 
Frontend apps using React.js with batteries included.

### Technologies: 
* React.js
* Redux
* Redux Saga
* Redux Thunk
* Ant design 
* FullCalendar
* Lodash

### Approach/challenges: 
Create SPA with persisted state. 

### Features
```bash
- Redux state management [redux](https://github.com/reactjs/redux)
- SASS support [Sass](http://sass-lang.com/)
- Easy deployment using [Surge.sh](https://surge.sh/)
- API [Stackable.space](http://www.stackabke.space/)
- Frontend styling framework [Semantic UI](http://semantic-ui.com/)
- Storybook Driven Development [Storybook](https://storybooks.js.org)
```

### Requirements
```bash
- [Node](https://nodejs.org) 4.x or better
```

### Stack
```bash
- [React](http://facebook.github.io/react) for development
- [Babel](http://babeljs.io/) for ES6+ support
- [create-react-app](https://github.com/facebookincubator/create-react-app) as stack
```

### Installation
Start by installing dependencies:

```sh
yarn install
```

### Running

Once dependencies are installed, run with:

```sh
yarn start
```

### Configuration

Configuration file is located at `./core/constants.js`

### Build

To build for production

```sh
yarn run build
```

### Tests

Running the Storybook

```sh
yarn run storybook
```

This will launch the storybook at [http://localhost:9009](http://localhost:9009)

Running jest tests

```sh
yarn run test
```

To write tests follow: [http://facebook.github.io/jest/docs/api.html](http://facebook.github.io/jest/docs/api.html)