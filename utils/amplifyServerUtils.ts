// utils/amplifyServerUtils.ts
import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import config from '@/amplify_outputs.json'; // Adjust path if needed

export const { runWithAmplifyServerContext } = createServerRunner({
    config
});