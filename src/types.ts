export type RiotPreprocessorType = 'template' | 'css' | 'javascript';

export type RegistrationOptions = {
  type: RiotPreprocessorType,
  name: string,
  preprocessorModulePath: string
}[];

export type TransformOptions = {
  registrations: RegistrationOptions,
  clearCache?: boolean 
};

export type TransformConfig = [string, string, TransformOptions?][];

export interface TransformerConfig {
  transform: TransformConfig,
  rootDir: string
}
