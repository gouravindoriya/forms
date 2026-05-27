import { z } from "zod";

export const createFormInputModal = z.object({
	title: z.string().max(100).describe("title of the form"),
	discription: z
		.string()
		.nullable()
		.optional()
		.describe("description of the form"),
});

export type createFormInputType = z.infer<typeof createFormInputModal>;

export const createFormOutputModal = z.object({
	id: z.string(),
});

export type createFormOutputType = z.infer<typeof createFormOutputModal>;

export const getFormByIdInputModal = z.object({
	id: z.string().describe("id of the form"),
});

export type getFormByIdInputType = z.infer<typeof getFormByIdInputModal>;

export const getFormByIdOutputModal = z.object({
	id: z.string(),
	title: z.string(),
	discription: z.string().nullable(),
	updatedAt: z.string().nullable(),
});

export type getFormByIdOutputType = z.infer<typeof getFormByIdOutputModal>;
