import { db, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";

import {
	type createFormInputType,
	type createFormOutputType,
	type getFormByIdInputType,
	type getFormByIdOutputType,
	createFormInputModal,
	createFormOutputModal,
	getFormByIdInputModal,
	getFormByIdOutputModal,
} from "./modal";

export async function createForm(
	payload: createFormInputType,
	createdby: string,
): Promise<createFormOutputType> {
	const { title, discription } = await createFormInputModal.parseAsync(payload);

	const result = await db
		.insert(formsTable)
		.values({
			title,
			discription: discription ?? null,
			createdby,
		})
		.returning({
			id: formsTable.id,
		});

	if (!result || result.length === 0 || !result[0]?.id) {
		throw new Error("something went wrong while creating a form");
	}

	return createFormOutputModal.parse({
		id: result[0].id,
	});
}

export async function getFormById(
	payload: getFormByIdInputType,
): Promise<getFormByIdOutputType> {
	const { id } = await getFormByIdInputModal.parseAsync(payload);

	const result = await db
		.select({
			id: formsTable.id,
			title: formsTable.title,
			discription: formsTable.discription,
			updatedAt: formsTable.updatedAt,
		})
		.from(formsTable)
		.where(eq(formsTable.id, id))
		.limit(1);

	if (!result || result.length === 0 || !result[0]) {
		throw new Error("form with given id does not exists");
	}

	return getFormByIdOutputModal.parse({
		...result[0],
		discription: result[0].discription ?? null,
		updatedAt: result[0].updatedAt?.toISOString() ?? null,
	});
}

export {
	createFormInputModal,
	createFormOutputModal,
	getFormByIdInputModal,
	getFormByIdOutputModal,
};
