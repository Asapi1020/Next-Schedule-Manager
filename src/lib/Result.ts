export default interface Result<T> {
	statusCode: number;
	payload: T | null;
}
