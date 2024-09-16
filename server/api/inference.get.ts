export default defineEventHandler(
	async (event): Promise<CreationSelect[]> => {
		const user = await assertAuthenticated(event);

		return db.transaction(async (tx) => {
			const service = createReplicateInferenceService(tx, event);
			return await service.list(user.id);
		});
	},
);