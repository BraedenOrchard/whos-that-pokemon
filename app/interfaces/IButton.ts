export interface IButton{
  key?: number,
  id?: number,
  text: string,
  onClick: (key?: number) => void
}