// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;

interface AppConfig {
  schemaOptions?: Object;
  previews?: Array<Object>;
  readonly base_url: string;
  api_url: (pid_type: string, pid_value: string) => string;
}
