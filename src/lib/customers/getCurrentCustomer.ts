import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function getCurrentCustomer() {
    const user = await getCurrentUser();

    if (!user) {
        return null;
    }

    const customer =
        await prisma.customer.findUnique({
            where: {
                userId: user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },

                addresses: true,
            },
        });

    return customer;
}