declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "*.md" {
  const value: string;
  export default value;
}
