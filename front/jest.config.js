module.exports = {
  testPathIgnorePatterns: ["C:/Users/LENOVO/coding_file/untact_interview/front/.next/", "C:/Users/LENOVO/coding_file/untact_interview/front/node_modules/"],
  setupFilesAfterEnv: ["C:/Users/LENOVO/coding_file/untact_interview/front/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "C:/Users/LENOVO/coding_file/untact_interview/front/node_modules/babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  }
};
