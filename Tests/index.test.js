const axios2 = require('axios');

const BACKEND_URL = 'http://localhost:9000';
// const WS_URL = "ws://localhost:3001"

const axios = {
   post: async (...args) => {
      try {
         const res = await axios2.post(...args);
         return res;
      } catch (e) {
         return e.response;
      }
   },
   get: async (...args) => {
      try {
         const res = await axios2.get(...args);
         return res;
      } catch (e) {
         return e.response;
      }
   },
   put: async (...args) => {
      try {
         const res = await axios2.put(...args);
         return res;
      } catch (e) {
         return e.response;
      }
   },
   delete: async (...args) => {
      try {
         const res = await axios2.delete(...args);
         return res;
      } catch (e) {
         return e.response;
      }
   },
};

describe('Authentication', () => {
   test('User is able to sign up only once', async () => {
      const username = "test" + Math.random();
      const password = "123456";

      const response = await axios.post(`${BACKEND_URL}/signup`, {
         username,
         password,
      })
      expect(response.status).toBe(200)

      const updatedResponse = await axios.post(`${BACKEND_URL}/signup`, {
         username,
         password,
      })
      expect(updatedResponse.status).toBe(422);
   });

   test('Signup request fails if the either username or password empty', async () => {
      const username = 'test';
      const password = '123456';

      const response1 = await axios.post(`${BACKEND_URL}/signup`, {
         username,
      });
      expect(response1.status).toBe(422);

      const response2 = await axios.post(`${BACKEND_URL}/signup`, {
         password,
      });
      expect(response2.status).toBe(422);
   });

   test('Signin succeeds if the username and password are correct', async () => {
      const username = `test-${Math.random()}`
      const password = "123456"

      await axios.post(`${BACKEND_URL}/signup`, {
         username,
         password,
      });

      const response = await axios.post(`${BACKEND_URL}/signin`, {
         username,
         password
      });

      expect(response.status).toBe(200)
      expect(response.data.token).toBeDefined()

   })

   test('Signin fails if the password is incorrect', async () => {
      const username = `test-${Math.random()}`
      const password = "123456"

      await axios.post(`${BACKEND_URL}/signup`, {
         username,
         password,
      });

      const response = await axios.post(`${BACKEND_URL}/signin`, {
         username,
         password: '456987'
      })

      expect(response.status).toBe(401)
   })

   test('Signin fails if the username does not exists', async () => {
      const response = await axios.post(`${BACKEND_URL}/signin`, {
         username: "WrongUsername",
         password: '145632'
      })

      expect(response.status).toBe(404)
   })
});
