import chalk from 'chalk';

export const logWarning = (...str: string[]) => console.log(chalk.yellow(...str))
export const logError = (...str: string[]) => console.log(chalk.bold.red(...str))
export const logSuccess = (...str: string[]) => console.log(chalk.bold.green(...str))
export const logInfo = (...str: string[]) => console.log(chalk.bold.blue(...str))