module.exports = {
  extends: [
    'eslint-config-ali/typescript/react',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  rules: {
    'react/no-multi-comp': 0,
    '@typescript-eslint/member-ordering': 0,
  },
};
