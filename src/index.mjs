import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.sendStatus(400);
  }

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) {
    return res.sendStatus(404);
  }
  req.findUserIndex = findUserIndex;
  next();
};

app.use(express.json());

const mockUsers = [
  { id: 1, username: "Jame", displayName: "jame" },
  { id: 2, username: "Jack", displayName: "jack01" },
  { id: 3, username: "Jhon", displayName: "jHonOK" },
];

//Get Params
app.get("/", (req, res) => {
  const { body } = req;
  res.status(201).send((mockUsers[0] = { ...body }));
});

//Query Params
app.get("/api/users", (req, res) => {
  const {
    query: { filter, value },
  } = req;
  if (filter && value) {
    return res
      .status(201)
      .send(mockUsers.filter((user) => user[filter].includes(value)));
  }
  return res.status(201).send(mockUsers);
});

//Post Params
app.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body }; //อธิบาย วิธ๊นี้เป็นการเพิ่ม User ใหม่โดยการทำ index-1 เพื่อให้ไปอัพเดท id ใหม่โดย id ไม่ซ้ำกัน คือมันไปต่อด้านหลังสุดนั่นแหละ
  mockUsers.push(newUser); //ทำเพิ่มผู้ใช้ใหม่
  return res.status(201).send(newUser);
});

//Route Params
app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Bad Request. Invalid ID." });
  }

  const findeUser = mockUsers.find((user) => user.id === parsedId);
  if (!findeUser) {
    return res.sendStatus(404);
  }
  return res.send(findeUser);
});


//PUT Requests
app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  /**
   * id: mockUsers[findUserIndex].id ไว้อ้างถึง obj id เพื่อไม่ให้ค่า id เปลี่ยนแปลงจากการอัพเดทจาก method put  (เดิมใช้ id: parsedId เพื่อเก็บค่าไอดีไว้)
   * อันใหม่ใช้ id:  mockUsers[findUserIndex].id จัดการโดย middleware resolveIndexByUserId
   * เนื่องจาก parsedId นำไปเทียบค่าใน findUserIndex แล้วได้ค่าตรงตามที่ต้องการจึงใช้ mockUsers[findUserIndex].id แทนและเข้าถึง obj id ได้เลย
   */
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

//Patch Requests
app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  //...mockUsers[findUserIndex] เป็นการกระจายข้อมูลเดิม
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

//Delete Requests
app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  mockUsers.splice(findUserIndex, 1);
  return res.sendStatus(200);
});

//server
app.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});
