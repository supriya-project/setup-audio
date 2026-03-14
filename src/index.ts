import * as exec from "@actions/exec";

async function run(): Promise<void> {
  switch (process.platform) {
    case "linux": {
      await exec.exec("sudo", ["apt-get", "update"]);
      await exec.exec("sudo", ["apt-get", "install", "--yes", "jackd2"]);
      await exec.exec("sudo", [
        "usermod",
        "-a",
        "-G",
        "audio",
        process.env.USER,
      ]);
      await exec.exec("sudo", [
        "-E",
        "su",
        process.env.USER,
        "-c",
        "jackd -r -ddummy -r44100 -p1024",
        "&",
      ]);
      await exec.exec("sleep", ["5"]);
      break;
    }
    case "darwin": {
      await exec.exec("brew", ["install", "jack"]);
      await exec.exec("sudo", [
        "-E",
        "su",
        process.env.USER,
        "-c",
        "jackd -r -ddummy -r44100 -p1024",
        "&",
      ]);
      await exec.exec("sleep", ["5"]);
      break;
    }
    case "win32": {
      await exec.exec("choco", ["install", "asio4all", "-y", "--no-progress"]);
      break;
    }
  }
}

run();
