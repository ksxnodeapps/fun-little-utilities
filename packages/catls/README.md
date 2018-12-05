# CatLs

Invoke ls on directories, cat on files

## Usage

```
$ catls [options] <list of files or directories>

Options:
  --version                                 Show version number        [boolean]
  --cat, --cmdCat, -c                       Cat program[string] [default: "cat"]
  --ls, --cmdLs, -l                         Ls program  [string] [default: "ls"]
  --dontFakeInteractive, --noInteractive,   Do not use script command
  --noScript, -n                                                       [boolean]
  --handleEmptyArguments, --onZeroArgs, -z  What to do when there is no
                                            arguments
                          [choices: "quiet", "warn", "error"] [default: "error"]
  --followSymlink, --follow                 Follow symlink, value can be a
                                            natural number or Infinite
                                                         [string] [default: "0"]
  --symlinkResolution, --symlink            How to treat symbolic links
             [choices: "agnostic", "relative", "ultimate"] [default: "relative"]
  --sharedArguments, --arguments, --args,   Comma-separated list of additional
  -A                                        arguments to pass to cat and ls
                                                          [string] [default: ""]
  --lsArguments, --lsArgs, -L               Comma-separated list of additional
                                            arguments to pass to ls
                                                          [string] [default: ""]
  --catArguments, --catArgs, -C             Comma-separated list of additional
                                            arguments to pass to cat
                                                          [string] [default: ""]
  -h, --help                                Show help                  [boolean]

Examples:
  catls directory-or-file                   Execute cat or ls on
                                            directory-or-file
  catls --follow=inf symlink                Show information of symlink and its
                                            targets
  catls --lsArguments=--all                 Execute colorls on directory
  --ls=colorls directory
  env CMD_LS=colorls LS_ARGUMENTS=--all     Specifying options via environment
  catls directory                           variables

```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
