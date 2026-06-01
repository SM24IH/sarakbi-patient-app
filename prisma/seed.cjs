const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

/** Local development only — use strong passwords and `db:create-staff` for production staff accounts. */
const SEED_PASSWORD = process.env.SEED_ACCOUNT_PASSWORD || "local-dev-only-change-me";

async function main() {
  const password = await bcrypt.hash(SEED_PASSWORD, 12);

  const staff = await prisma.user.upsert({
    where: { email: "staff@clinic.invalid" },
    update: {},
    create: {
      email: "staff@clinic.invalid",
      passwordHash: password,
      name: "Clinic team",
      phone: null,
      role: Role.STAFF,
    },
  });

  const patient = await prisma.user.upsert({
    where: { email: "patient@clinic.invalid" },
    update: {},
    create: {
      email: "patient@clinic.invalid",
      passwordHash: password,
      name: "Registered patient",
      phone: null,
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

  console.log("Seed complete. Staff:", staff.email, "| Patient:", patient.email);
  console.log("Use SEED_ACCOUNT_PASSWORD in .env for the password (see prisma/seed.cjs).");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
