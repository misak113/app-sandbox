
export interface IActionNameValues<Enum> {
	[name: number]: string;
}
export interface IActionNameKeys<Enum> {
	[name: string]: Enum;
}
type ActionNameStatic<Enum> = IActionNameValues<Enum> | IActionNameKeys<Enum>;
export default ActionNameStatic;
