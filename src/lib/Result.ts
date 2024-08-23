export default interface Result<T> {
	statusCode: number;
	data: T | null;
	error?: string;
}
