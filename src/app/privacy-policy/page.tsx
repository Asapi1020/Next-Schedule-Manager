const PrivacyPolicy = () => {
	return (
		<div className="container mx-auto px-6 py-4">
			<div className="px-2 py-4 border-b border-gray-700">
				<h1 className="text-2xl">Privacy Policy</h1>
			</div>
			<div className="px-2 py-4">
				<h2 className="text-xl px-2 border-l-4 border-gray-700">
					Purpose of Use of Personal Information
				</h2>
				<div className="px-4 py-6">
					<p className="mb-4">
						This website may require your Discord account and other personal
						information when you sign up or sign in.
					</p>
					<p className="mb-4">
						Personal information obtained will be used only for necessary
						account management and will not be used for any other purposes.
					</p>
					<p className="mb-4">
						Personal information obtained will be managed appropriately and will
						not be disclosed to third parties except in the following cases
					</p>
					<ul className="px-4 py-4 list-disc list-inside text-gray-300">
						<li className="py-2">
							When the consent of the person in question has been obtained
						</li>
						<li>When disclosure is required by law</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default PrivacyPolicy;
