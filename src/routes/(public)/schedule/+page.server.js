import { redirect } from "@sveltejs/kit";

export async function load({}) {
    let currentDate = new Date();
    redirect(302, `/schedule/${currentDate.toISOString().split('T')[0]}/`);
}