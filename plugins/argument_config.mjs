const args = process.argv;

export function getArguments() {
    const prefixes = ['--debug=', '--env='];
    let result = {};

    args.forEach(arg => {
        prefixes.forEach(prefix => {
            if (arg.startsWith(prefix)) {
                const key = prefix.slice(2, prefix.length - 1);
                result[key] = arg.slice(prefix.length);
            }
        });
    });
    console.log(args)
    return result;
}
