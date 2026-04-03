const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("demo1234", 12);

  const staff = await prisma.user.upsert({
    where: { email: "clinic@sarakbi.app" },
    update: {},
    create: {
      email: "clinic@sarakbi.app",
      passwordHash: password,
      name: "Cadogan Clinic Team",
      phone: "+44 20 0000 0000",
      role: Role.STAFF,
    },
  });

  const patient = await prisma.user.upsert({
    where: { email: "patient@demo.app" },
    update: {},
    create: {
      email: "patient@demo.app",
      passwordHash: password,
      name: "Demo Patient",
      phone: "+44 7700 900000",
      role: Role.PATIENT,
    },
  });

  const existingThread = await prisma.messageThread.findFirst({
    where: { patientId: patient.id, subject: "Post-operative question" },
  });
  if (!existingThread) {
    await prisma.messageThread.create({
      data: {
        patientId: patient.id,
        subject: "Post-operative question",
        messages: {
          create: [
            {
              senderId: patient.id,
              body: "Hello — I had a quick question about dressing changes after my procedure.",
            },
            {
              senderId: staff.id,
              body: "Thank you for your message. A member of the team will respond within one working day. If this is urgent, please call the clinic number on your discharge letter.",
            },
          ],
        },
      },
    });
  }

  const apptCount = await prisma.appointment.count({
    where: { patientId: patient.id, type: "Follow-up consultation" },
  });
  if (apptCount === 0) {
    await prisma.appointment.create({
      data: {
        patientId: patient.id,
        location: "Cadogan Clinic, Chelsea",
        type: "Follow-up consultation",
        requestedAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notes: "Prefer morning if possible.",
        status: "REQUESTED",
      },
    });
  }

  console.log("Seed complete. Staff:", staff.email, "| Patient:", patient.email, "| Password: demo1234");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
