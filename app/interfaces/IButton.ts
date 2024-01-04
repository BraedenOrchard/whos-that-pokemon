export interface IPrimaryButton{
  text: string,
  onClick: (key?: number) => void
}

export interface IOptionButtonProps {
  id: number;
  text: string;
  onClick: () => void;
  className: string;
}