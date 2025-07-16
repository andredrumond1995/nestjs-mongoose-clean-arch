export interface UsecasePort<Output, Input = any> {
  execute(input?: Input): Output | Promise<Output>;
}
