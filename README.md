# Citizen Flashcards App

## Overview
The Citizen Flashcards App is a mobile-friendly web application designed to help users learn and review important questions and answers related to U.S. citizenship. The app features interactive flashcards that display questions in both English and a second language, allowing users to test their knowledge effectively.

## Features
1. **Flash Cards**: 
   - Displays questions in both languages.
   - Answers are hidden until clicked, providing an interactive learning experience.

2. **Random 10 Questions**: 
   - Randomly selects 10 questions from the database.
   - Each question's answer is hidden until the user clicks to reveal it.

## Project Structure
```
citizen-flashcards-app
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── FlashCard.tsx
│   │   ├── FlashCardList.tsx
│   │   ├── RandomTen.tsx
│   │   └── Layout.tsx
│   ├── data
│   │   └── questions.json
│   ├── App.tsx
│   ├── index.tsx
│   └── styles
│       └── App.css
├── package.json
├── tsconfig.json
└── README.md
```

## Installation
To get started with the Citizen Flashcards App, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd citizen-flashcards-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

## Usage
- Navigate to the app in your web browser.
- Use the Flash Cards feature to review questions and answers.
- Try the Random 10 Questions feature for a quick quiz.

## Contributing
Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.