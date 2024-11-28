import chalk from "chalk";

export const createLoading = () => {
    let processing = true;
    const spinnerSymbols = ['|', '/', '-', '\\'];
    let i = 0;
  
    const interval = setInterval(() => {
      if (processing) {
        process.stdout.write(
          `\r${chalk.blue('Processing')} ${chalk.green(spinnerSymbols[i++ % spinnerSymbols.length])}`
        );
      }
    }, 200); 
    return () => {
      processing = false;
      clearInterval(interval);
      process.stdout.write(`\r${chalk.yellow('Process complete!')}\n`); // Pesan selesai dengan warna kuning
    };
  };