export const handleCopyLink = (invitationId: string) => {
	const link = `${process.env.NEXT_PUBLIC_FRONTEND_ADDRESS}/invitation/${invitationId}`;

	// eslint-disable-next-line n/no-unsupported-features/node-builtins
	navigator.clipboard
		.writeText(link)
		.then(() => {
			alert("Link copied to clipboard!");
		})
		.catch((error) => {
			console.error("Failed to copy:", error);
		});
	return;
};
