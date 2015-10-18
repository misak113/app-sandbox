
type ActionNameStatic<Enum> = { [name: string]: Enum; } | { [name: number]: string; };
export default ActionNameStatic;
