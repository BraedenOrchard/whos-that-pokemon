export interface IButton{
  key?: number,
  id?: number,
  text: string,
  buttonState?: boolean | null,
  onClick: (key?: number) => void
}