# Nexon Dev VN site

A Nexon Dev VN Company Site project to build a static HTML page using HTML, react and SCSS.

## Run Locally

Clone the project

--SSH

```bash
  git clone git@bitbucket.org:nexondv/nexon-dev-vn-site.git
```

--HTTPS

```bash
  git clone https://gbnexon@bitbucket.org/nexondv/nexon-dev-vn-site.git
```

Go to the project directory

```bash
  cd nexon-dev-vn-site
```

Install dependencies

```bash
  yarn
```

Start the server

```bash
  yarn dev
```

## Documentation

[Jira](https://nexondv.atlassian.net/jira/software/c/projects/NDVCS/boards/47)

### Project Architecture
### React

```
src/
├── assets/
│   ├── images/
│   ├── fonts/
│   └── videos/
├── elements/
│   ├── button/
│   │   ├── button.html
│   │   ├── button.scss
│   │   └── button.js
│   ├── input/
│   │   ├── input.html
│   │   ├── input.scss
│   │   └── input.js
│   └── ...
├── section/
│   ├── home/
│   │   ├── styles/
│   │   ├── components/
│   │   ├── homSection.tsx
│   │
│   └── ...
├── main.tsx
├── styles/
├── type/
└── mocks/
```
- 1 component per file

- Use Separation of Concern if your component have too many logic

- Config or Data should be put in an immutable constant

- Avoid empty html tag, use self-closing tag if you need one

- Prefer named export over default export

- Each component should be put inside separate folder

- Each component folder should consist of index.ts and MyComponent.tsx

- Context Providers should be put inside providers folder

### Git

- Commit message should be in format: <subject>: JIRA-TICKET <message>
- Use imperative voice
- Branch should be in format: <feature/bugfix/release/refactor/hotfix>/JIRA-TICKET-what-the-branch-for

## Contributors

- Nguyen Nguyen Khang - [khangnguyen@nexondv.com](mailto:khangnguyen@nexondv.com)
- Le Dam Duy Phuc - [permees@nexondv.com](mailto:permees@nexondv.com)
- Do Le Hoang Gia Bao - [kelvin@nexondv.com](mailto:kelvin@nexondv.com)
