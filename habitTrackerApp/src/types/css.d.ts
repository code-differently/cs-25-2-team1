// CSS module type declarations for Next.js
declare module "*.css";
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}