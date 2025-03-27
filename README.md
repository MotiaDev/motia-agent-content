# Setup Instructions

## Install pnpm
First, you need to install `pnpm` if you haven't already:
```sh
npm install -g pnpm
```

## Install Dependencies
Next, install the project dependencies using `pnpm`:
```sh
pnpm install
```

## Link Motia Monorepo Dependencies
Temporarily, you will need to download the Motia monorepo and link the `@motia/snap` and `@motia/dev` dependencies:
1. Clone the Motia monorepo:
  ```sh
  git clone <motia-monorepo-url>
  cd motia-monorepo
  pnpm install
  ```
2. Link the dependencies:
  ```sh
  cd packages/core
  pnpm link --global @motia/core

  cd ../snap
  pnpm link --global @motia/snap
  ```

## Install python dependencies

To install the Python dependencies, run the following command:
```sh
pip install -r requirements.txt
```

## Running the Project
To run the project, use the following command:
```sh
pnpm run dev
```

## Testing the Setup
Once the project is running, execute the following `curl` command to test the flow:
```sh
curl -X POST http://localhost:3000/vision-agent \
   -H "Content-Type: application/json" \
   -d '{
     "image_url": "https://media.istockphoto.com/id/1079580668/photo/happy-college-students-listening-to-a-lecturer-in-the-classroom.jpg?s=612x612&w=0&k=20&c=Z8GbAuac_J3lUPKT5bI4Uw4GZskBOA0Y_p8A1xOWarw="
}'
```