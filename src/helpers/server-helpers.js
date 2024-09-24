import prisma from "@prisma"


export const connectToDatabase = async ()  => {
    try {
        await prisma.connectToDatabase();
    } catch (error) {
        console.log(error);
        throw new Error("unable to connect to database")
    }
}