const axios2 = require('axios');
const { WebSocket } = require('ws');

// const BACKEND_URL = 'https://metaverse-http-server.vercel.app';
const BACKEND_URL = 'http://localhost:9000';
const WS_URL = 'ws://localhost:9001';

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
      const username = 'test' + Math.random();
      const password = '123456';

      const response = await axios.post(`${BACKEND_URL}/signup`, {
         username,
         password,
      });
      expect(response.status).toBe(200);

      const updatedResponse = await axios.post(`${BACKEND_URL}/signup`, {
         username,
         password,
      });
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
      const username = `test-${Math.random()}`;
      const password = '123456';
      await axios.post(`${BACKEND_URL}/signup`, {
         username,
         password,
      });
      const response = await axios.post(`${BACKEND_URL}/signin`, {
         username,
         password,
      });

      expect(response.status).toBe(200);
      expect(response.data.token).toBeDefined();
   });

   test('Signin fails if the password is incorrect', async () => {
      const username = `test-${Math.random()}`;
      const password = '123456';
      await axios.post(`${BACKEND_URL}/signup`, {
         username,
         password,
      });
      const response = await axios.post(`${BACKEND_URL}/signin`, {
         username,
         password: '456987',
      });

      expect(response.status).toBe(401);
   });

   test('Signin fails if the username does not exists', async () => {
      const response = await axios.post(`${BACKEND_URL}/signin`, {
         username: 'WrongUsername',
         password: '145632',
      });

      expect(response.status).toBe(404);
   });
});

describe('User metadata endpoint', () => {
   let token = '';
   let avatarId = '';

   beforeAll(async () => {
      const username = `test-${Math.random()}`;
      const password = '123456';
      await axios.post(`${BACKEND_URL}/signup`, {
         username,
         password,
         role: 'admin',
      });
      const response = await axios.post(`${BACKEND_URL}/signin`, {
         username,
         password,
      });
      token = response.data.token;

      const avatarResponse = await axios.post(
         `${BACKEND_URL}/admin/avatar`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s',
            name: 'Timmy',
         },
         {
            headers: {
               authorization: `Bearer ${token}`,
            },
         }
      );
      avatarId = avatarResponse.data.avatarId;
   });

   test('User cant update their metadata with a wrong avatar id', async () => {
      const response = await axios.post(
         `${BACKEND_URL}/api/v1/user/metadata`,
         {
            avatarId: '123123123',
         },
         {
            headers: {
               authorization: `Bearer ${token}`,
            },
         }
      );

      expect(response.status).toBe(404);
   });

   test('User can update their metadata with the right avatar id', async () => {
      const response = await axios.post(
         `${BACKEND_URL}/user/metadata`,
         {
            avatarId,
         },
         {
            headers: {
               authorization: `Bearer ${token}`,
            },
         }
      );

      expect(response.status).toBe(200);
   });

   test('User is not able to update their metadata if the auth header is not present', async () => {
      const response = await axios.post(`${BACKEND_URL}/user/metadata`, {
         avatarId,
      });

      expect(response.status).toBe(401);
   });
});

describe('User avatar information', () => {
   let avatarId;
   let token;
   let userId;

   beforeAll(async () => {
      const username = `test-${Math.random()}`;
      const password = '123456';
      const signupResponse = await axios.post(`${BACKEND_URL}/signup`, {
         username,
         password,
         role: 'admin',
      });
      userId = signupResponse.data.userId;

      const response = await axios.post(`${BACKEND_URL}/signin`, {
         username,
         password,
      });
      token = response.data.token;

      const avatarResponse = await axios.post(
         `${BACKEND_URL}/admin/avatar`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s',
            name: 'Timmy',
         },
         {
            headers: {
               authorization: `bearer ${token}`,
            },
         }
      );
      avatarId = avatarResponse.data.avatarId;
   });

   test('Get back avatar information for a user', async () => {
      const response = await axios.get(
         `${BACKEND_URL}/user/metadata/bulk?ids=[${userId}]`,
         {
            headers: {
               authorization: `bearer ${token}`,
            },
         }
      );

      expect(response.data.avatars.length).toBe(1);
      expect(response.data.avatars[0].userId).toBe(userId);
   });

   test('Available avatars lists the recently created avatar', async () => {
      const response = await axios.get(`${BACKEND_URL}/avatars`);
      expect(response.data.avatars.length).not.toBe(0);

      const currentAvatar = response.data.avatars.find((x) => x.id == avatarId);
      expect(currentAvatar).toBeDefined();
   });
});

describe('Space information', () => {
   let mapId;
   let element1Id;
   let element2Id;
   let adminToken;
   let userToken;

   beforeAll(async () => {
      const username = `test-${Math.random()}`;
      const password = '123456';

      await axios.post(`${BACKEND_URL}/signup`, {
         username,
         password,
         role: 'admin',
      });
      const adminSignin = await axios.post(`${BACKEND_URL}/signin`, {
         username,
         password,
      });
      adminToken = adminSignin.data.token;

      await axios.post(`${BACKEND_URL}/signup`, {
         username: username + '-user',
         password,
      });
      const userSigninResponse = await axios.post(`${BACKEND_URL}/signin`, {
         username: username + '-user',
         password,
      });
      userToken = userSigninResponse.data.token;

      const element1Response = await axios.post(
         `${BACKEND_URL}/admin/element`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE',
            width: 1,
            height: 1,
            static: true,
         },
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );

      const element2Response = await axios.post(
         `${BACKEND_URL}/admin/element`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE',
            width: 1,
            height: 1,
            static: true,
         },
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );

      element1Id = element1Response.data.elementId;
      element2Id = element2Response.data.elementId;

      const mapResponse = await axios.post(
         `${BACKEND_URL}/admin/map`,
         {
            thumbnail: 'https://thumbnail.com/a.png',
            dimensions: '100x200',
            name: 'Test space',
            defaultElements: [
               {
                  elementId: element1Id,
                  x: 20,
                  y: 20,
               },
               {
                  elementId: element1Id,
                  x: 18,
                  y: 20,
               },
               {
                  elementId: element2Id,
                  x: 19,
                  y: 20,
               },
            ],
         },
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );

      mapId = mapResponse.data.mapId;
   });

   test('User is able to create a space', async () => {
      const response = await axios.post(
         `${BACKEND_URL}/space`,
         {
            name: 'Test',
            dimensions: '100x200',
            mapId: mapId,
         },
         {
            headers: {
               authorization: `Bearer ${userToken}`,
            },
         }
      );

      expect(response.status).toBe(200);
      expect(response.data.spaceId).toBeDefined();
   });

   test('User is able to create a space without mapId (empty space)', async () => {
      const response = await axios.post(
         `${BACKEND_URL}/space`,
         {
            name: 'Test',
            dimensions: '100x200',
         },
         {
            headers: {
               authorization: `Bearer ${userToken}`,
            },
         }
      );

      expect(response.data.spaceId).toBeDefined();
   });

   test('User is not able to create a space without mapId and dimensions', async () => {
      const response = await axios.post(
         `${BACKEND_URL}/space`,
         {
            name: 'Test',
         },
         {
            headers: {
               authorization: `Bearer ${userToken}`,
            },
         }
      );

      expect(response.status).toBe(422);
   });

   test('User is not able to delete a space that does not exist', async () => {
      const response = await axios.delete(`${BACKEND_URL}/space/56`, {
         headers: {
            authorization: `Bearer ${userToken}`,
         },
      });

      expect(response.status).toBe(404);
   });

   test('User is able to delete a space that does exist', async () => {
      const response = await axios.post(
         `${BACKEND_URL}/space`,
         {
            name: 'Test',
            dimensions: '100x200',
         },
         {
            headers: {
               authorization: `Bearer ${userToken}`,
            },
         }
      );
      const deleteResponse = await axios.delete(
         `${BACKEND_URL}/space/${response.data.spaceId}`,
         {
            headers: {
               authorization: `Bearer ${userToken}`,
            },
         }
      );

      expect(deleteResponse.status).toBe(204);
   });

   test('User should not be able to delete a space created by another user', async () => {
      const response = await axios.post(
         `${BACKEND_URL}/space`,
         {
            name: 'Test',
            dimensions: '100x200',
         },
         {
            headers: {
               authorization: `Bearer ${userToken}`,
            },
         }
      );
      const deleteResponse = await axios.delete(
         `${BACKEND_URL}/space/${response.data.spaceId}`,
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );

      expect(deleteResponse.status).toBe(403);
   });

   // test('Admin has no spaces initially', async () => {
   //    const response = await axios.get(`${BACKEND_URL}/space/all`, {
   //       headers: {
   //          authorization: `Bearer ${adminToken}`,
   //       },
   //    });
   //
   //    expect(response.data.spaces.length).toBe(0);
   // });
   //
   // test('Admin gets one space after after creating it', async () => {
   //    const spaceCreateResponse = await axios.post(
   //       `${BACKEND_URL}/space`,
   //       {
   //          name: 'Test',
   //          dimensions: '100x200',
   //       },
   //       {
   //          headers: {
   //             authorization: `Bearer ${adminToken}`,
   //          },
   //       }
   //    );
   //    const response = await axios.get(`${BACKEND_URL}/space/all`, {
   //       headers: {
   //          authorization: `Bearer ${adminToken}`,
   //       },
   //    });
   //    const filteredSpace = response.data.spaces.find(
   //       (x) => x.id == spaceCreateResponse.data.spaceId
   //    );
   //
   //    expect(response.data.spaces.length).toBe(1);
   //    expect(filteredSpace).toBeDefined();
   // });
});

describe('Arena endpoints', () => {
   let mapId;
   let element1Id;
   let element2Id;
   let adminToken;
   let userToken;
   let spaceId;

   beforeAll(async () => {
      const username = `test-${Math.random()}`;
      const password = '123456';
      await axios.post(`${BACKEND_URL}/signup`, {
         username,
         password,
         role: 'admin',
      });
      const adminSignin = await axios.post(`${BACKEND_URL}/signin`, {
         username,
         password,
      });
      adminToken = adminSignin.data.token;

      await axios.post(`${BACKEND_URL}/signup`, {
         username: username + '-user',
         password,
      });
      const userSignin = await axios.post(`${BACKEND_URL}/signin`, {
         username: username + '-user',
         password,
      });
      userToken = userSignin.data.token;

      const element1Response = await axios.post(
         `${BACKEND_URL}/admin/element`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE',
            width: 1,
            height: 1,
            static: true,
         },
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );

      const element2Response = await axios.post(
         `${BACKEND_URL}/admin/element`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE',
            width: 1,
            height: 1,
            static: true,
         },
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );
      element1Id = element1Response.data.elementId;
      element2Id = element2Response.data.elementId;

      const mapResponse = await axios.post(
         `${BACKEND_URL}/admin/map`,
         {
            thumbnail: 'https://thumbnail.com/a.png',
            dimensions: '100x200',
            name: 'Test space',
            defaultElements: [
               {
                  elementId: element1Id,
                  x: 20,
                  y: 20,
               },
               {
                  elementId: element1Id,
                  x: 18,
                  y: 20,
               },
               {
                  elementId: element2Id,
                  x: 19,
                  y: 20,
               },
            ],
         },
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );
      mapId = mapResponse.data.mapId;

      const spaceResponse = await axios.post(
         `${BACKEND_URL}/space`,
         {
            name: 'Test',
            dimensions: '100x200',
            mapId: mapId,
         },
         {
            headers: {
               authorization: `Bearer ${userToken}`,
            },
         }
      );
      spaceId = spaceResponse.data.spaceId;
   });

   test('Incorrect spaceId returns a 404', async () => {
      const response = await axios.get(`${BACKEND_URL}/api/v1/space/123kasdk01`, {
         headers: {
            authorization: `Bearer ${userToken}`,
         },
      });

      expect(response.status).toBe(404);
   });

   test('Correct spaceId returns all the elements', async () => {
      const response = await axios.get(`${BACKEND_URL}/space/${spaceId}`, {
         headers: {
            authorization: `Bearer ${userToken}`,
         },
      });

      expect(response.data.dimensions).toBe('100x200');
      expect(response.data.elements.length).toBe(3);
   });

   test('Delete endpoint is able to delete an element', async () => {
      const response = await axios.get(`${BACKEND_URL}/space/${spaceId}`, {
         headers: {
            authorization: `Bearer ${userToken}`,
         },
      });

      await axios.delete(`${BACKEND_URL}/space/element`, {
         data: { spaceElementId: response.data.elements[0].id },
         headers: {
            authorization: `Bearer ${userToken}`,
         },
      });

      const newResponse = await axios.get(`${BACKEND_URL}/space/${spaceId}`, {
         headers: {
            authorization: `Bearer ${userToken}`,
         },
      });

      expect(newResponse.data.elements.length).toBe(2);
   });

   test('Adding an element fails if the element lies outside the dimensions', async () => {
      const newResponse = await axios.post(
         `${BACKEND_URL}/space/element`,
         {
            elementId: element1Id,
            spaceId: spaceId,
            x: 10000,
            y: 210000,
         },
         {
            headers: {
               authorization: `Bearer ${userToken}`,
            },
         }
      );

      expect(newResponse.status).toBe(400);
   });

   test('Adding an element works as expected', async () => {
      const response = await axios.post(
         `${BACKEND_URL}/space/element`,
         {
            spaceId: spaceId,
            elementId: element1Id,
            x: 50,
            y: 20,
         },
         {
            headers: {
               authorization: `Bearer ${userToken}`,
            },
         }
      );

      expect(response.status).toBe(200);
   });
});

describe('Admin Endpoints', () => {
   let adminToken;
   let userToken;

   beforeAll(async () => {
      const username = `test-${Math.random()}`;
      const password = '123456';
      await axios.post(`${BACKEND_URL}/signup`, {
         username,
         password,
         role: 'admin',
      });

      const response = await axios.post(`${BACKEND_URL}/signin`, {
         username,
         password,
      });
      adminToken = response.data.token;

      await axios.post(`${BACKEND_URL}/signup`, {
         username: username + '-user',
         password,
         role: 'User',
      });

      const userSigninResponse = await axios.post(`${BACKEND_URL}/signin`, {
         username: username + '-user',
         password,
      });
      userToken = userSigninResponse.data.token;
   });

   test('User is not able to hit admin Endpoints', async () => {
      const elementResponse = await axios.post(
         `${BACKEND_URL}/admin/element`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE',
            width: 1,
            height: 1,
            static: true,
         },
         {
            headers: {
               authorization: `Bearer ${userToken}`,
            },
         }
      );

      const mapResponse = await axios.post(
         `${BACKEND_URL}/admin/map`,
         {
            thumbnail: 'https://thumbnail.com/a.png',
            dimensions: '100x200',
            name: 'test space',
            defaultElements: [],
         },
         {
            headers: {
               authorization: `Bearer ${userToken}`,
            },
         }
      );

      const avatarResponse = await axios.post(
         `${BACKEND_URL}/admin/avatar`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s',
            name: 'Timmy',
         },
         {
            headers: {
               authorization: `Bearer ${userToken}`,
            },
         }
      );

      const updateElementResponse = await axios.put(
         `${BACKEND_URL}/admin/element/123`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s',
         },
         {
            headers: {
               authorization: `Bearer ${userToken}`,
            },
         }
      );

      expect(elementResponse.status).toBe(401);
      expect(mapResponse.status).toBe(401);
      expect(avatarResponse.status).toBe(401);
      expect(updateElementResponse.status).toBe(401);
   });

   test('Admin is able to hit admin Endpoints', async () => {
      const elementResponse = await axios.post(
         `${BACKEND_URL}/admin/element`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE',
            width: 1,
            height: 1,
            static: true,
         },
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );

      const mapResponse = await axios.post(
         `${BACKEND_URL}/admin/map`,
         {
            thumbnail: 'https://thumbnail.com/a.png',
            name: 'Space',
            dimensions: '100x200',
            defaultElements: [],
         },
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );

      const avatarResponse = await axios.post(
         `${BACKEND_URL}/admin/avatar`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s',
            name: 'Timmy',
         },
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );

      expect(elementResponse.status).toBe(200);
      expect(mapResponse.status).toBe(200);
      expect(avatarResponse.status).toBe(200);
   });

   test('Admin is able to update the imageUrl for an element', async () => {
      const elementResponse = await axios.post(
         `${BACKEND_URL}/admin/element`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE',
            width: 1,
            height: 1,
            static: true,
         },
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );

      const updateElementResponse = await axios.put(
         `${BACKEND_URL}/admin/element/${elementResponse.data.elementId}`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s',
         },
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );

      expect(updateElementResponse.status).toBe(200);
   });
});

describe('Websocket tests', () => {
   let adminToken;
   let adminUserId;
   let userToken;
   let adminId;
   let userId;
   let mapId;
   let element1Id;
   let element2Id;
   let spaceId;
   let ws1;
   let ws2;
   let ws1Messages = [];
   let ws2Messages = [];
   let userX;
   let userY;
   let adminX;
   let adminY;

   async function waitForAndPopLatestMessage(messageArray) {
      while (messageArray.length === 0) {
         await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return messageArray.shift();
   }

   async function setupHTTP() {
      const username = `test-${Math.random()}`;
      const password = '123456';

      const adminSignup = await axios.post(`${BACKEND_URL}/signup`, {
         username,
         password,
         role: 'admin',
      });
      adminUserId = adminSignup.data.userId;

      const adminSignin = await axios.post(`${BACKEND_URL}/signin`, {
         username,
         password,
      });
      adminToken = adminSignin.data.token;

      const userSignupResponse = await axios.post(`${BACKEND_URL}/signup`, {
         username: username + '-user',
         password,
      });
      userId = userSignupResponse.data.userId;

      const userSigninResponse = await axios.post(`${BACKEND_URL}/signin`, {
         username: username + '-user',
         password,
      });
      userToken = userSigninResponse.data.token;

      const element1Response = await axios.post(
         `${BACKEND_URL}/admin/element`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE',
            width: 1,
            height: 1,
            static: true,
         },
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );

      const element2Response = await axios.post(
         `${BACKEND_URL}/admin/element`,
         {
            imageUrl:
               'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE',
            width: 1,
            height: 1,
            static: true,
         },
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );

      element1Id = element1Response.data.elementId;
      element2Id = element2Response.data.elementId;

      const mapResponse = await axios.post(
         `${BACKEND_URL}/admin/map`,
         {
            thumbnail: 'https://thumbnail.com/a.png',
            dimensions: '100x200',
            name: 'Test space',
            defaultElements: [
               {
                  elementId: element1Id,
                  x: 20,
                  y: 20,
               },
               {
                  elementId: element1Id,
                  x: 18,
                  y: 20,
               },
               {
                  elementId: element2Id,
                  x: 19,
                  y: 20,
               },
            ],
         },
         {
            headers: {
               authorization: `Bearer ${adminToken}`,
            },
         }
      );
      mapId = mapResponse.data.mapId;

      const spaceResponse = await axios.post(
         `${BACKEND_URL}/space`,
         {
            name: 'Test',
            dimensions: '100x200',
            mapId: mapId,
         },
         {
            headers: {
               authorization: `Bearer ${userToken}`,
            },
         }
      );
      spaceId = spaceResponse.data.spaceId;
   }
   async function setupWs() {
      ws1 = new WebSocket(WS_URL);
      ws1.onmessage = (event) => {
         ws1Messages.push(JSON.parse(event.data));
      };
      await new Promise((r) => {
         ws1.onopen = r;
      });

      ws2 = new WebSocket(WS_URL);
      ws2.onmessage = (event) => {
         ws2Messages.push(JSON.parse(event.data));
      };
      await new Promise((r) => {
         ws2.onopen = r;
      });
   }

   beforeAll(async () => {
      await setupHTTP();
      await setupWs();
   });

   test('Get back ack for joining the space', async () => {
      ws1.send(
         JSON.stringify({
            type: 'join',
            payload: {
               spaceId: spaceId,
               token: adminToken,
            },
         })
      );
      const message1 = await waitForAndPopLatestMessage(ws1Messages);

      ws2.send(
         JSON.stringify({
            type: 'join',
            payload: {
               spaceId: spaceId,
               token: userToken,
            },
         })
      );
      const message2 = await waitForAndPopLatestMessage(ws2Messages);
      const message3 = await waitForAndPopLatestMessage(ws1Messages);

      expect(message1.type).toBe('space-joined');
      expect(message2.type).toBe('space-joined');

      expect(message1.payload.users.length).toBe(0);
      expect(message2.payload.users.length).toBe(1);

      expect(message3.type).toBe('user-joined');
      expect(message3.payload.x).toBe(message2.payload.spawn.x);
      expect(message3.payload.y).toBe(message2.payload.spawn.y);
      expect(message3.payload.userId).toBe(userId);

      adminX = message1.payload.spawn.x;
      adminY = message1.payload.spawn.y;

      userX = message2.payload.spawn.x;
      userY = message2.payload.spawn.y;
   });

   test('User should not be able to move across the boundary of the wall', async () => {
      ws1.send(
         JSON.stringify({
            type: 'move',
            payload: {
               x: 1000000,
               y: 10000,
            },
         })
      );

      const message = await waitForAndPopLatestMessage(ws1Messages);
      expect(message.type).toBe('movement-rejected');
      expect(message.payload.x).toBe(adminX);
      expect(message.payload.y).toBe(adminY);
   });

   test('User should not be able to move two blocks at the same time', async () => {
      ws1.send(
         JSON.stringify({
            type: 'move',
            payload: {
               x: adminX + 2,
               y: adminY,
            },
         })
      );

      const message = await waitForAndPopLatestMessage(ws1Messages);
      expect(message.type).toBe('movement-rejected');
      expect(message.payload.x).toBe(adminX);
      expect(message.payload.y).toBe(adminY);
   });

   test('User should not be able to move across the boundary of the wall', async () => {
      ws1.send(
         JSON.stringify({
            type: 'move',
            payload: {
               x: 1000000,
               y: 10000,
            },
         })
      );

      const message = await waitForAndPopLatestMessage(ws1Messages);
      expect(message.type).toBe('movement-rejected');
      expect(message.payload.x).toBe(adminX);
      expect(message.payload.y).toBe(adminY);
   });

   test('User should not be able to move two blocks at the same time', async () => {
      ws1.send(
         JSON.stringify({
            type: 'move',
            payload: {
               x: adminX + 2,
               y: adminY,
            },
         })
      );

      const message = await waitForAndPopLatestMessage(ws1Messages);
      expect(message.type).toBe('movement-rejected');
      expect(message.payload.x).toBe(adminX);
      expect(message.payload.y).toBe(adminY);
   });

   test('Correct movement should be broadcasted to the other sockets in the room', async () => {
      ws1.send(
         JSON.stringify({
            type: 'move',
            payload: {
               x: adminX + 1,
               y: adminY,
               userId: adminId,
            },
         })
      );

      const message = await waitForAndPopLatestMessage(ws2Messages);
      expect(message.type).toBe('movement');
      expect(message.payload.x).toBe(adminX + 1);
      expect(message.payload.y).toBe(adminY);
   });

   test('If a user leaves, the other user receives a leave event', async () => {
      ws1.close();
      const message = await waitForAndPopLatestMessage(ws2Messages);
      expect(message.type).toBe('user-left');
      expect(message.payload.userId).toBe(adminUserId);
   });
});
