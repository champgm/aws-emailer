
export default class Logger {
  log(message) {
    const output = `${this.constructor.name}: ${message}`;
    console.log(output);
    return output;
  }
}
