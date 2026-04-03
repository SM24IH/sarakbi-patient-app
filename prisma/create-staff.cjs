const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const val = argv[i + 1];
    if (!key || !key.startsWith("--")) continue;
    if (!val || val.startsWith("--")) {
      out[key.slice(2)] = true;
      continue;
    }
    out[key.slice(2)] = val;
    i += 1;
  }
  return out;
}

function usage() {
  console.log(
    [
      "Create or update a STAFF account.",
      "",
      "Usage:",
      "  npm run db:create-staff -- --email surgeon@example.com --name \"Clinic Team\" --password \"StrongPass123!\" [--phone \"+44 20 ...\"]",
      "",
      "Flags:",
      "  --email      Required",
      "  --name       Required",
      "  --password   Required (8+ chars)",
      "  --phone      Optional",
    ].join("\n"),
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    usage();
    return;
  }

  const emailRaw = String(args.email || "").trim().toLowerCase();
  const nameRaw = String(args.name || "").trim();
  const passwordRaw = String(args.password || "");
  const phoneRaw = args.phone ? String(args.phone).trim() : null;

  if (!emailRaw || !nameRaw || !passwordRaw) {
    usage();
    throw new Error("Missing required flags: --email, --name, --password");
  }
  if (passwordRaw.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(passwordRaw, 12);

  const user = await prisma.user.upsert({
    where: { email: emailRaw },
    update: {
      name: nameRaw,
      phone: phoneRaw,
      role: Role.STAFF,
      passwordHash,
    },
    create: {
      email: emailRaw,
      name: nameRaw,
      phone: phoneRaw,
      role: Role.STAFF,
      passwordHash,
    },
  });

  console.log(`Staff account ready: ${user.email} (${user.name})`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e.message || e);
    prisma.$disconnect();
    process.exit(1);
  });
