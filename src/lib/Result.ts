export default interface Result<T = null> {
	statusCode: number;
	data: T | null;
	error?: string;
}
