
export interface IEnumValues<Enum> {
	[name: number]: string;
}
export interface IEnumKeys<Enum> {
	[name: string]: Enum;
}
type EnumStatic<Enum> = IEnumValues<Enum> | IEnumKeys<Enum>;
export default EnumStatic;
