// https://stackoverflow.com/questions/56261381/how-do-i-set-a-timezone-in-my-jest-config
// Jest tests always run in UTC timezone for consistency

module.exports = async () => {
  process.env.TZ = 'UTC';
};