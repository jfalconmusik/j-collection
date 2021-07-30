/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";
const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp({
  databaseURL: "https://jiva-website-405ed.firebaseio.com",
  credential: admin.credential.cert({
    projectId: "jiva-website-405ed",
    clientEmail: "jiva-website-405ed@appspot.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCeF0iLnQOXiL0P\nI2egiMweuqULCstyoWvrvKnJ5w7bXxdSykvMygy/Yr/fAxxjedV/RpcKQqHXSD4L\n7zB5tjVfbBSbG9+8dGNYRqz3OobLuDCpY2ce7Th3AvRjY0lrdolHWIBK472CnDcu\n/XfSYodw9A1IeRLkT1++hK/fMXPXfPCx/q3pz0yCwqzkrUg8o0d5+gxB/SlHf/tZ\n8RdhjO0VC0IUEYu9lQtV9jfPXwbw+5i4dshPdwcjAPVpnZSBhdbDVzcyuDiBTYmi\nyFr9ohc5h/xCdklXeJEVqeq3pFWh9HYYxv2Qr94rtud22dqiPNUPC2AHiQtbBdes\n3+BMZ4MjAgMBAAECggEABTu9FY4Vk9sdcxZXdFuC8lN4ajSpxnosgenFbx8cgUuV\nEJMMzlMz99PziRTnyC080ZFLJ7ZL+D32e9unrafH/Ygs6HOURP9PWJlCWY7Q7oaC\n6eCWBdKRh3MMFwwu3oVWhwuZd6ExYVT9iKswX8EOPcF+fRMw+mjcQQjQb6GJ9ayq\nUNARqxht6ccYvWaQfCMB8oWvcxVQYgQUWh5tF+vU6//rU7zDb8f4GbT80ppMIV3K\nSj9ptwQXId5t2SZHJvn8z/pjb0nlNISIVbN/8rRrw8i2gFYJkKwCPyAYlf7P91Wg\n+CTSkrmOQ8JYRgfyajB61ijCdI8yObhO64FWxoEidQKBgQDRIa3luGGMPIBkSYrx\nUtz9Owvdlw7pd25RUpTz8Mli8f7wleFpWhiGo6FON3eHm+/Xef3LWUHmo6lkhGyg\n36dZjLGdxf8AQWVyj9oeKXTWukxB3ELCi0jbqLokiAx+KZnTDL3Qze2KZDX5TW1v\nO31dnJ0Hwmd2rnMo1Cny9Na69QKBgQDBhUvUCFp1BnqgVsbJDdMGKBTyz2ugteCm\npHGHwhMH4qOdOuroNaeaJtiJlxBqbU3gCZW5tdycG1SICTml5krWbNgN7ah26us8\nCgqKNl4qlXqWlKEo536Z21gAd4aeSDL0BYLsvY1JpzfESWAYUEgMSXlOJLjwyFue\npMKjUNmmtwKBgQC3CDD4Uu0dHX6JR0xRdWJwRxNVdvXYI2zrw8kVzvGSpZWo3qSP\n3giFHgT5PdZhW3sILX6QUKg6wZZpoPSpv9TprRdurHFHufSd1YTizQmzPQ2svqe3\nOMwlY4C2pFO6v5IfgpFGhFSXwKj0bm2O4pQQMBfHSL/gwUGMxFOKjfq5WQKBgA5B\nn6BzLRbJ72a4fdR57D3b3g81MJyaSX59Rs/VgElobN08ZenNahd1HSaltlPg0Yfb\nrOgNeb8WVFfhNhn+qSy6v//mri50h/fYVYZxEubYNDu7n1PAGheDjSwbohMvBnHr\npgWCwVHXu8f+D9I6t9QP5ZvYILe8SuOZB624WxBpAoGBAMLj8nOI8sKnBk+6G4Il\nN5VEbBtsVujCR+0UlcD4wkcmFc6yWKGZfodQwpVmde1MOb0sLQYiL8WMzBNA0J0c\nPsj0mm9CbNO+fPVZomL7Y1tdjwh6IA/PjxfN0T6cLynSJXks1kEb2tYjbZ/17xgr\nJsST4Pr2TGOjUh1vaA21DFIz\n-----END PRIVATE KEY-----\n",
  }),
});

const db = admin.firestore();

const logging = require("@google-cloud/logging");
const nodemailer = require(`nodemailer`);
const directTransport = require(`nodemailer-direct-transport`);
const stripe = require("stripe")(functions.config().stripe.token);
const currency = functions.config().stripe.currency || "USD";

// Replace if using a different env file or config
// const env = require("dotenv").config({ path: "./.env" });
// const stripe = require("stripe")("sk_test_ueyEzSe0gWZLWBJwcqGTkdgg00AfnC9xtc");

exports.allowNotifications = functions.https.onCall((data, context) => {
  return admin
    .firestore()
    .collection("stripe_customers")
    .doc(context.auth.uid)
    .update({
      allowNotify: data.bool,
    });
});

// exports.updateDarkMode = functions.https.onCall((data, context) => {
//     let userID = context.auth.uid
//     let bool = data.bool

//     return db.collection('stripe_customers').doc(userID).update({ darkMode: bool })
// })

exports.contactUsEmail = functions.https.onCall((data, context) => {
  let message = data.messageText;
  let name = data.name;
  let email = data.email;
  let userID = context.auth.uid;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "jfalconmusik@gmail.com", // generated ethereal user
      pass: "bozxnfpjcaswiixq", // specific to this app
    },
  });

  // send mail with defined transport object
  let adminEmail = transporter.sendMail({
    from: "<no-reply-jivas-originals@gmail.com>", // sender address
    to: "jivasoriginals@gmail.com", // list of receivers
    subject: `Jiva's Originals - Message from ${name}`, // Subject line
    text: "newText", // plain text body
    html: `<p> Name: ${name} Email: ${email} Uid: ${userID} Message: ${message} </p>`, // html body
  });

  return adminEmail;
});

// When a user is created, register them with Stripe
exports.createStripeCustomer = functions.auth.user().onCreate(async (user) => {
  const customer = await stripe.customers.create({ email: user.email });
  return admin.firestore().collection("stripe_customers").doc(user.uid).set({
    customer_id: customer.id,
    customer_email: user.email,
    userID: user.uid,
    paymentIntent: null,
    paymentsComplete: [],
    cart: [],
    address_shipping: [],
    address_billing: [],
    wishlist: [],
    receipt_email: "",
    payMethod: [],
    firstName: "",
    lastName: "",
    storeCredit: 0,
    allowNotify: true,
    staySignedIn: true,
    darkMode: true,
  });
});

exports.updateStaySignedIn = functions.https.onCall((data, context) => {
  const bool = data.bool;
  const userID = context.auth.uid;

  const updateDoc = db
    .collection("stripe_customers")
    .doc(userID)
    .update({ staySignedIn: bool });
});

exports.createAnonStripeCustomer = functions.https.onCall(
  async (data, context) => {
    const userID = context.auth.uid;
    const userEmail = data.userEmail;
    const addressShip = data.tempShipAddress;
    const addressBill = data.tempBillAddress;
    const customer = await stripe.customers.create({ email: userEmail });
    return admin.firestore().collection("stripe_customers").doc(userID).set({
      customer_id: customer.id,
      customer_email: userEmail,
      userID: userID,
      paymentIntent: null,
      paymentsComplete: [],
      cart: [],
      address_shipping: addressShip,
      address_billing: addressBill,
      wishlist: [],
      receipt_email: "",
      payMethod: [],
    });
  }
);

exports.saveUserAddress = functions.https.onCall((data, context) => {
  const userID = context.auth.uid;
  const addressInfo = data.addressInfo;
  console.log(addressInfo);
  const customerDoc = db.doc(`stripe_customers/${userID}`);
  if (
    addressInfo.addressType === "shipping" &&
    addressInfo.sameAsOtherAddress
  ) {
    console.log("address is both shipping and billing");
    return customerDoc.update({
      address_shipping: [
        addressInfo.firstName,
        addressInfo.lastName,
        addressInfo.country,
        addressInfo.address1,
        addressInfo.address2,
        addressInfo.city,
        addressInfo.state,
        addressInfo.zipCode,
        addressInfo.phone,
        addressInfo.sameAsOtherAddress,
      ],
      address_billing: [
        addressInfo.firstName,
        addressInfo.lastName,
        addressInfo.country,
        addressInfo.address1,
        addressInfo.address2,
        addressInfo.city,
        addressInfo.state,
        addressInfo.zipCode,
        addressInfo.phone,
        addressInfo.sameAsOtherAddress,
      ],
    });
  } else if (addressInfo.addressType === "shipping") {
    console.log("updating shipping address only");
    return customerDoc.update({
      address_shipping: [
        addressInfo.firstName,
        addressInfo.lastName,
        addressInfo.country,
        addressInfo.address1,
        addressInfo.address2,
        addressInfo.city,
        addressInfo.state,
        addressInfo.zipCode,
        addressInfo.phone,
        addressInfo.sameAsOtherAddress,
      ],
    });
  } else if (addressInfo.addressType === "billing") {
    console.log("updating billing address only");
    return customerDoc.update({
      address_billing: [
        addressInfo.firstName,
        addressInfo.lastName,
        addressInfo.country,
        addressInfo.address1,
        addressInfo.address2,
        addressInfo.city,
        addressInfo.state,
        addressInfo.zipCode,
        addressInfo.phone,
        addressInfo.sameAsOtherAddress,
      ],
    });
  }
});

exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  if (data.totalCost) {
    const payAmount = data.totalCost;
    console.log(`totalCost: ${payAmount}`);
    const userID = context.auth.uid;
    const customerPromise = await db
      .collection(`stripe_customers`)
      .doc(userID)
      .get("customer_id");
    const customerID = customerPromise.data().customer_id;
    if (
      !customerPromise.data().paymentIntent ||
      customerPromise.data().paymentIntent === null ||
      customerPromise.data().paymentIntent.amount !== payAmount
    ) {
      return await stripe.paymentIntents
        .create({
          amount: payAmount,
          currency: "usd",
          payment_method_types: ["card"],
          customer: customerID,
          receipt_email: context.auth.token.email,
          metadata: { integration_check: "accept_a_payment" },
        })
        .then(async (response) => {
          await db
            .collection(`stripe_paymentIntents`)
            .doc(response.id)
            .set({ ...response });
          return await db
            .collection(`stripe_customers`)
            .doc(userID)
            .update({
              paymentIntent: `stripe_paymentIntents/${response.id}`,
            });
        })
        .catch((error) => {
          console.log("error getting pi data: " + error);
        });
    } else {
      return new Promise((resolve, reject) => {
        resolve("paymentIntent already exists.");
        reject(Error);
      });
    }
  } else if (data.moddedCost) {
    const payAmount = data.moddedCost;
    console.log(`totalCost: ${payAmount}`);
    const userID = context.auth.uid;
    const customerPromise = await db
      .collection(`stripe_customers`)
      .doc(userID)
      .get("customer_id");
    const customerID = customerPromise.data().customer_id;
    if (
      !customerPromise.data().paymentIntent ||
      customerPromise.data().paymentIntent === null ||
      customerPromise.data().paymentIntent.amount !== payAmount
    ) {
      return await stripe.paymentIntents
        .create({
          amount: payAmount,
          currency: "usd",
          payment_method_types: ["card"],
          customer: customerID,
          receipt_email: context.auth.token.email,
          metadata: { integration_check: "accept_a_payment" },
        })
        .then(async (response) => {
          await db
            .collection(`stripe_paymentIntents`)
            .doc(response.id)
            .set({ ...response });
          return await db
            .collection(`stripe_customers`)
            .doc(userID)
            .update({
              paymentIntent: `stripe_paymentIntents/${response.id}`,
            });
        })
        .catch((error) => {
          console.log("error getting pi data: " + error);
        });
    } else {
      return new Promise((resolve, reject) => {
        resolve("paymentIntent already exists.");
        reject(Error);
      });
    }
  }
});

exports.getClientSecret = functions.https.onCall(async (data, context) => {
  console.log(data);
  const userID = context.auth.uid;
  console.log(userID);
  if (data) {
    if (data.payMethod && data.rememberCard) {
      const payMethod = data.payMethod;
      db.doc(`/stripe_customers/${userID}`).update({
        payMethod: [
          payMethod.last4,
          payMethod.brand,
          payMethod.country,
          payMethod.id,
        ],
      });
    } else {
      console.log("no paymethod");
    }
  }
  const cusIdDocument = await db.doc(`/stripe_customers/${userID}`).get();
  const cusPiDocRef = cusIdDocument.data().paymentIntent;
  console.log(cusIdDocument.data());
  console.log(cusPiDocRef);
  const pendingIntent = await db.doc(`${cusPiDocRef}`).get();
  console.log(pendingIntent.data());
  const client_secret = pendingIntent.data().client_secret.toString();
  console.log(client_secret);
  return new Promise((resolve, reject) => {
    resolve(`${client_secret}`);
    reject(error);
  });
});

exports.updateCredit = functions.https.onCall((data, context) => {
  const storeCreditUsedProto = data.storeCreditUsed;
  const userID = context.auth.uid;
  console.log(userID);

  if (Number(storeCreditUsedProto) > 0) {
    const storeCreditUsed = Number(storeCreditUsedProto) / 100;

    const cusIdDocument = db
      .doc(`/stripe_customers/${userID}`)
      .get()
      .then((doc) => {
        let prevCredit = doc.data().storeCredit;

        let newCredit = Number(prevCredit - storeCreditUsed);
        console.log("credit updated");

        return db
          .doc(`/stripe_customers/${userID}`)
          .update({ storeCredit: newCredit });
      })
      .catch((error) => {
        return console.log("error updating user credit " + error);
      });
    return cusIdDocument;
  }
});

exports.exchangeOrder = functions.https.onCall((data, context) => {
  console.log(data);

  // need:
  // userID, confirmation ID, itemList, arrivalDate,
  // to be retrieved herein: email and timestamp
  // total amount of store credit used is unnecessary as this function only works
  // if the amount used exactly matches the order cost

  // this function combines every other individual function of the order process into one,
  // as I wrote it after I wrote all the others. Hopefully it doesn't break....

  const userID = context.auth.uid;
  const confirmID = data.orderString;
  const itemList = data.itemList;
  const arrivalDate = data.deliverDate;
  // const created = data.timeStamp
  let note = data.exchangeNote;
  let noteArr = [];
  if (note) {
    noteArr.push(note);
  } else {
    noteArr.push("none");
  }

  const itemNameArray = itemList.map((item) => {
    return item[0];
  });

  const itemFullOptionsArray = itemList.map((item) => {
    let itemColorSet = item[4].split("_");
    let itemColor = itemColorSet[0];
    let abbreviatedItem = `${item[0]} ($${Number(item[2]) / 100}, ${
      item[3]
    }, ${itemColor})`;
    return abbreviatedItem;
  });

  const itemOptionsString = itemFullOptionsArray.join("; ");

  const finalItemList = [];
  if (itemNameArray.length > 1) {
    const lastItem = itemNameArray.pop();
    console.log(lastItem);
    itemNameArray.push("and");
    itemNameArray.push(lastItem);
    let itemsString = itemNameArray.join(" ");
    finalItemList.push(itemsString);
  } else if (itemNameArray.length === 1) {
    finalItemList.push(itemNameArray[0]);
  }

  db.doc(`stripe_customers/${userID}`)
    .get()
    .then((document) => {
      console.log(document.data().address_shipping);
      const address_shipping = document.data().address_shipping;

      // const receiptEmail = document.data().customer_email

      // trim address to only relevant bits.
      address_shipping.slice(3, 8);
      if (address_shipping[1] === null) {
        address_shipping.splice(1, 1);
      }

      const address_shipping_brief = [
        address_shipping[3],
        address_shipping[5],
        address_shipping[7],
        address_shipping[8],
      ];

      const lastAddressShipping = address_shipping_brief.join(" ");
      console.log(lastAddressShipping);

      const receiverEmail = context.auth.token.email;
      console.log(receiverEmail);

      // const detailsArray = [orderDetails[0], orderDetails[1], orderDetails[2]]
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "jfalconmusik@gmail.com", // generated ethereal user
          pass: "bozxnfpjcaswiixq", // specific to this app
        },
      });

      // send mail with defined transport object
      let clientEmail = transporter.sendMail({
        from: "<no-reply-jivas-originals@gmail.com>", // sender address
        to: receiverEmail.toString(), // list of receivers
        subject: "Jiva's Originals Order Confirmation", // Subject line
        text: "newText", // plain text body
        html: `<h2>Jiva's Originals</h2>
                     <p>
                             Your Order of <b>${finalItemList}</b> has been confirmed
                              using your store credit.
                               It will be shipped to <b>${lastAddressShipping}</b>. 
                                 Estimated arrival date is: <b>${arrivalDate}</b>.
                                 Your Order Confirmation ID is <b>${confirmID}</b>.
                                  When your order ships, you will receive a follow-up email
                                  with your USPS tracking number.
                     </p>
                                   <img
                                      width="300px"
                                      height="auto"
                                      src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/logo%20rose%20finished.svg?alt=media&token=d4f6fc6b-cec1-4832-adcb-440dae63563b" />
                                   
                                   
                                   <h2>Jiva's Originals Return Policy:</h2>
                                   
                                   <p>Not in love with your purchase? That's okay. If you aren't satisfied,
                                   neither are we. If your item has not yet shipped, you will receive
                                   a full refund. If your order has shipped, but it's still within the 60 days of our return policy,
                                   you can ship your items back free of charge. We will provide you
                                   with either an exchange or store credit, whichever you prefer.</p>
                                   <p>If you decide to return your items, please use the same packaging.
                                       A return slip and a shipping label will be included with your items.</p>
                                   <p>If you have any questions or concerns regarding your return,
                                   feel free to call or text (504)-616-6756 or email us at
                                   <a href="mailto:jivasoriginals@gmail.com">jivasoriginals@gmail.com</a>. You can expect to hear back from us
                                       within 3 business days. </p>
                                   <h2>Jiva's Originals LLC</h2>
                                   `, // html body
      });

      let adminEmail = transporter.sendMail({
        from: "<no-reply-jivas-originals@gmail.com>", // sender address
        to: "jfalconmusik@gmail.com", // list of receivers
        subject: "Jiva Admin Console", // Subject line
        text: "newText", // plain text body
        html: `<h3>
                         An order of ${itemOptionsString} has been confirmed
                          as an exchange.
                           Ship to ${lastAddressShipping}.
                           The orderID is ${confirmID}.
                           The customer's user ID is ${userID}.
                             Expected arrival date is: ${arrivalDate}.
                               </h3>
                               <p>Customer's note: ${noteArr[0]}</p>
                               <br></br><br></br><br></br>
                               <h2>
                               Jiva's Originals LLC
                               </h2>`, // html body
      });

      // create item string...

      let newCostArr = [];

      let newItemList = itemList.map((item) => {
        newCostArr.push(item[2]);

        let newObject = {
          itemName: item[0],
          itemColor: item[3],
          itemSize: item[4],
        };

        return newObject;
      });

      //%%${item[1]}%%${item[2]}%%${item[3]}%%${item[4]} -- may need to add more details to the orders...

      let finalCost = newCostArr.reduce((a, b) => a + b, 0);

      let date = Date.now();
      console.log("date: " + date);
      let timeStamp = `${date}`;
      let newTimeStamp = timeStamp.slice(0, 10);

      let order_data = {
        items: newItemList,
        orderID: confirmID,
        shipLocation: address_shipping,
        userID: context.auth.uid,
        type: "exchange",
        receipt_email: context.auth.token.email,
        created: newTimeStamp,
        amount: finalCost,
        storeCreditUsed: finalCost,
        note: noteArr[0],
        uspsStatus: "Not Yet Shipped",
        uspsTracking: "",
      };

      console.log("orderData: " + order_data);

      const cartDocument = db.doc(`carts/${userID}`);
      let updateCart = cartDocument
        .get()
        .then((doc) => {
          if (doc.exists) {
            let emptyArr = [];
            return cartDocument.update({
              // ...cartDocument.data,
              items: [...emptyArr],
            });
          } else {
            return console.log("doc doesn't exist");
          }
        })
        .catch((error) => {
          console.log("error calling cart document: " + error);
        });
      console.log(timeStamp);
      let uidAndTime = `${userID}_${timeStamp}`;
      console.log(uidAndTime);

      ///////////////

      db.collection("exchanges")
        .doc(uidAndTime)
        .get()
        .then((doc) => {
          if (doc.exists) {
            return console.log("document data: " + doc.data());
          } else {
            return console.log("document doesn't exist");
          }
        })
        .catch((error) => {
          return console.log(
            "couldn't even try to get the exchange doc " + error
          );
        });

      db.collection("exchanges").doc(uidAndTime).set({ order_data });
      db.collection("orders").doc(uidAndTime).set({ order_data });

      itemList.map((item) => {
        let itemQuery = db
          .collection(`/products`)
          .where("productName", "==", `${itemName}`);
        let updateFunction = itemQuery
          .get()
          .then((snapshot) => {
            if (snapshot.empty) {
              return console.log("no matching product");
            }
            let updateItems = snapshot.forEach((product) => {
              console.log(product.data());
              console.log(product.id);
              let productId = product.id;
              let prevOrdered = product.data().Ordered;

              let emptyArr = [];

              let itemColorFull = item[4].split("_");
              let itemColor = itemColorFull[0];

              if (item[3] === "One-Size") {
                emptyArr.push("oneSize");
              } else {
                let itemSize = item[3].split("/").join("").toLowerCase();
                emptyArr.push(itemSize);
              }

              let optionsString = `${itemColor}_${emptyArr[0]}`;

              let prevStockCount = product.data().Stock[optionsString];

              let newStockCount = Number(prevStockCount) - 1;

              let orderedNum = Number(prevOrdered);
              let newNum = Number(orderedNum + 1);

              console.log(orderedNum, newNum);

              const productDoc = db
                .collection(`/products`)
                .doc(`${productId}`)
                .update({
                  Ordered: newNum,
                  [`Stock.${optionsString}`]: newStockCount,
                });

              return productDoc;
            });
            return updateItems;
          })
          .catch((error) => {
            return console.log(error);
          });
        return updateFunction;
      });

      return {
        updateCart,
        adminEmail,
        clientEmail,
      };

      // return {
      //     adminEmail,
      //     clientEmail
      // }
    })
    .catch((error) => {
      console.log("error doing everything: " + error);
    });

  // must: create timestamp
  // let uidAndTime = `${userID}_${timeStamp}`

  // const cartDocData = db.doc(`carts/${userID}`).get()
  //     .then(result => {
  //         if (result.exists) {
  //             console.log(result.data())
  //             return console.log("cart data deleted?: " + result.data())
  //         } else {
  //             return console.log("cart doc data call returned nada")
  //         }
  //     })
  //     .catch(error => {
  //         return console.log("could not retrieve cart document: " + error)
  //     })

  // then: send email...
});

exports.updateDatabase = functions.https.onCall(async (data, context) => {
  if (data.result.status === "succeeded") {
    const userID = context.auth.uid;
    console.log(data);
    const confirmID = data.orderString;
    const shipAddress = data.shipAddress;
    const storeCreditUsed = data.storeCreditUsed;
    const note = data.checkoutNote;
    let noteArr = [];
    if (note) {
      noteArr.push(note);
    } else {
      noteArr.push("none");
    }
    console.log(confirmID);
    const cusIdDocument = await db.doc(`stripe_customers/${userID}`).get();
    const cusPiDocRef = cusIdDocument.data().paymentIntent;
    let addressShipping = cusIdDocument.data().address_shipping;

    let shippingArr = [];

    if (shipAddress) {
      shippingArr.push(shipAddress);
    } else {
      shippingArr.push(addressShipping);
    }
    console.log(cusPiDocRef);
    console.log(cusIdDocument.data());
    const pendingIntent = db.doc(`${cusPiDocRef}`);

    await db.doc(`stripe_paymentsConfirmed/${data.result.id}`).set({
      ...data.result,
    });
    await pendingIntent.delete();
    await db.doc(`stripe_customers/${userID}`).update({
      paymentIntent: null,
      paymentsComplete: [
        ...cusIdDocument.data().paymentsComplete,
        `stripe_paymentsConfirmed/${data.result.id}`,
      ],
    });

    let itemNameArray = data.itemNameArray;
    let itemListProto = data.itemList;
    let itemList = itemListProto.map((item) => {
      return { itemName: item[0], itemSize: item[3], itemColor: item[4] };
    });

    console.log(itemList);

    // let userIDSubstring = userID.substring(0, 4)

    // let randNum = (Math.floor(Math.random() * 100000))

    // let semiUniqueString = `${userIDSubstring}${randNum}`
    // console.log(semiUniqueString)

    const cartDocument = db.doc(`carts/${userID}`);
    cartDocument
      .get()
      .then((doc) => {
        if (doc.exists) {
          return cartDocument.update({
            // ...cartDocument.data,
            items: [],
          });
        } else {
          return console.log("doc doesn't exist");
        }
      })
      .catch((error) => {
        console.log("error calling cart document: " + error);
      });

    const cartDocData = db
      .doc(`carts/${userID}`)
      .get()
      .then((result) => {
        if (result.exists) {
          console.log(result.data());
          return console.log("cart data deleted?: " + result.data());
        } else {
          return console.log("cart doc data call returned nada");
        }
      })
      .catch((error) => {
        return console.log("could not retrieve cart document: " + error);
      });
    console.log(cartDocument);
    console.log(cartDocData);
    // console.log(cartDocData.data())

    let timeStamp = data.result.created;
    console.log(timeStamp);

    let uidAndTime = `${userID}_${timeStamp}`;

    if (shipAddress) {
      let order_data = {
        items: itemList,
        orderIDString: confirmID,
        shipLocation: shippingArr[0],
        userID: context.auth.uid,
        type: "purchase",
        storeCreditUsed: storeCreditUsed,
        note: noteArr[0],
        uspsStatus: "Not Yet Shipped",
        uspsTracking: "",
        ...data.result,
      };
      return db.collection("orders").doc(uidAndTime).set({ order_data });
    } else {
      const cusIdDocument = db
        .doc(`stripe_customers/${userID}`)
        .get()
        .then(async (document) => {
          console.log(document.data().address_shipping);
          const address_shipping = document.data().address_shipping;

          let order_data = {
            items: itemList,
            orderIDString: confirmID,
            shipLocation: address_shipping,
            userID: context.auth.uid,
            type: "purchase",
            storeCreditUsed: 0,
            note: noteArr[0],
            uspsStatus: "Not Yet Shipped",
            uspsTracking: "",
            ...data.result,
          };
          return db.collection("orders").doc(uidAndTime).set({ order_data });
        });
      return cusIdDocument;
    }
  }
});

exports.updateOrders = functions.https.onCall(async (data, context) => {
  const userID = context.auth.uid;
  const item = data.item;
  const itemName = item[0];
  let itemQuery = db
    .collection(`/products`)
    .where("productName", "==", `${itemName}`);
  let updateFunction = itemQuery
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return console.log("no matching product");
      }
      let updateItems = snapshot.forEach((product) => {
        console.log(product.data());
        console.log(product.id);
        let productId = product.id;
        let prevOrdered = product.data().Ordered;

        let emptyArr = [];

        let itemColorFull = item[4].split("_");
        let itemColor = itemColorFull[0];

        if (item[3] === "One-Size" || item[3] === "One Size") {
          emptyArr.push("oneSize");
        } else {
          let itemSize = item[3].split("/").join("").toLowerCase();
          emptyArr.push(itemSize);
        }

        let optionsString = `${itemColor}_${emptyArr[0]}`;

        let prevStockCount = product.data().Stock[optionsString];

        let newStockCount = Number(prevStockCount) - 1;

        let orderedNum = Number(prevOrdered);
        let newNum = Number(orderedNum + 1);

        console.log(orderedNum, newNum);

        const productDoc = db
          .collection(`/products`)
          .doc(`${productId}`)
          .update({
            Ordered: newNum,
            [`Stock.${optionsString}`]: newStockCount,
          });

        return productDoc;
      });
      return updateItems;
    })
    .catch((error) => {
      return console.log(error);
    });
  return updateFunction;
});

exports.getTwitterUserEmail = functions.https.onCall((data, context) => {
  const userID = context.auth.uid;

  return db
    .collection("/stripe_customers")
    .doc(userID)
    .get()
    .then((doc) => {
      return doc;
    });
});

exports.saveEmail = functions.https.onCall((data, context) => {
  const userID = context.auth.uid;
  const email = data.emailVal;
  console.log(email);
  let customerQuery = db
    .doc(`stripe_customers/${userID}`)
    .get()
    .then((doc) => {
      if (doc.data().customer_email) {
        return db.doc(`stripe_customers/${userID}`).update({
          receipt_email: email,
        });
      } else {
        return db.doc(`stripe_customers/${userID}`).update({
          receipt_email: email,
          customer_email: email,
        });
      }
    });
  return customerQuery;
  // const cusIdDocument =
  // return cusIdDocument
});

exports.sendReceiptEmailAnon = functions.https.onCall(async (data, context) => {
  const userID = context.auth.uid;
  const orderDetails = data.orderObj.orderObject;
  const orderString = data.orderObj.orderString;
  const orderItems = data.orderObj.itemList;
  const receiptEmail = data.orderObj.receiptEmail;
  const shipAddress = data.orderObj.shipAddress;
  console.log(orderDetails);
  console.log(orderItems);
  // place commas inside of order array and add the word "and", remove image url
  const itemNameArray = orderItems.map((item) => {
    return item[0];
  });

  const itemFullOptionsArray = orderItems.map((item) => {
    let itemColorSet = item[4].split("_");
    let itemColor = itemColorSet[0];
    let abbreviatedItem = `${item[0]} ($${Number(item[2]) / 100}, ${
      item[3]
    }, ${itemColor})`;
    return abbreviatedItem;
  });

  const itemOptionsString = itemFullOptionsArray.join("; ");

  const finalItemList = [];
  if (itemNameArray.length > 1) {
    const lastItem = itemNameArray.pop();
    console.log(lastItem);
    itemNameArray.push("and");
    itemNameArray.push(lastItem);
    let itemsString = itemNameArray.join(" ");
    finalItemList.push(itemsString);
  } else if (itemNameArray.length === 1) {
    finalItemList.push(itemNameArray[0]);
  }

  console.log(shipAddress);
  const address_shipping = shipAddress;
  // trim address to only relevant bits.
  address_shipping.slice(3, 8);
  if (address_shipping[1] === null) {
    address_shipping.splice(1, 1);
  }

  const address_shipping_brief = [
    address_shipping[3],
    address_shipping[5],
    address_shipping[7],
    address_shipping[8],
  ];

  const lastAddressShipping = address_shipping_brief.join(" ");

  const detailsArray = [orderDetails[0], orderDetails[1], orderDetails[2]];
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "jfalconmusik@gmail.com", // generated ethereal user
      pass: "bozxnfpjcaswiixq", // specific to this app
    },
  });

  // send mail with defined transport object
  let clientEmail = await transporter.sendMail({
    from: "<no-reply-jivas-originals@gmail.com>", // sender address
    to: receiptEmail.toString(), // list of receivers
    subject: "Jiva's Originals Order Confirmation", // Subject line
    text: "newText", // plain text body
    html: `<h2>Jiva's Originals</h2>
             <p>
                         Your order of <b>${finalItemList}</b> has been confirmed
                          for a total of <b>$${detailsArray[0]}</b> to your card ending in <b>****${detailsArray[1]}</b>.
                           It will be shipped to <b>${lastAddressShipping}</b>
                             Estimated arrival date is: <b>${detailsArray[2]}</b>.
                             The orderID is <b>${orderString}</b>.
                              Please follow the link below to track your package.
                               </p>
                               <a href='https://jivasoriginals.com/my-orders'>
                               Track My Order</a>
                               <img
                                  width="300px"
                                  height="auto"
                                  src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/logo%20rose%20finished.svg?alt=media&token=d4f6fc6b-cec1-4832-adcb-440dae63563b" />
                               
                               
                               <h2>Jiva's Originals Return Policy:</h2>
                               <p>Not in love with your purchase? That's okay. If you aren't satisfied,
                               neither are we. If it's within the 60 days of our return policy,
                               you can ship your items back free of charge. We will provide you
                               with either an exchange or store credit, whichever you prefer.</p>
                               
                               <p>If you decide to return your items, please use the same packaging.
                                   A return slip and a shipping label will be included with your items.</p>
                               
                               <p>If you have any questions or concerns regarding your return,
                               feel free to call or text (504)-616-6756 or email us at
                               <a href="mailto:jivasoriginals@gmail.com">jivasoriginals@gmail.com</a>. You can expect to hear back from us
                                   within 3 business days. </p>
                               <h2>
                               Jiva's Originals LLC
                               </h2>`, // html body
  });

  let adminEmail = await transporter.sendMail({
    from: "<no-reply-jivas-originals@gmail.com>", // sender address
    to: "jfalconmusik@gmail.com", // list of receivers
    subject: "Jiva Admin Console", // Subject line
    text: "newText", // plain text body
    html: `<p>
                     An order of ${itemOptionsString} has been confirmed
                      for a total of $${detailsArray[0]}.
                       Ship to ${lastAddressShipping}
                         Expected arrival date is: ${detailsArray[2]}.
                         The customer's user ID is ${userID}.
                         The orderID is...
                           </p>
                           <br></br><br></br><br></br>
                           <h2>
                           Jiva'a Originals LLC
                           </h2>`, // html body
  });
  return {
    adminEmail,
    clientEmail,
  };

  //     .catch(error => {
  //         console.log("error creating emails: " + error)
  //     })
  // return cusIdDocument
});

exports.payPalPayment = functions.https.onCall((data, context) => {
  const userID = context.auth.uid;
  // const payData = data.ppData
  const details = data.details;
  console.log(details);
  // console.log(payData)
  // let data = payData

  // let randNum = (Math.floor(Math.random() * 100000))

  return db.doc(`paypalOrders/${userID}`).set({
    // [`${randNum}Data`]: data,
    [`${details.id}`]: details,
  });
});

exports.sendReceiptEmail = functions.https.onCall(async (data, context) => {
  const userID = context.auth.uid;
  const orderDetails = data.orderObj.orderObject;
  const orderItems = data.orderObj.itemList;
  const receiptEmail = data.orderObj.receiptEmail;
  const orderString = data.orderObj.orderString;
  const note = data.orderObj.checkoutNote;
  let noteArr = [];

  if (note) {
    noteArr.push(note);
  } else {
    noteArr.push("none");
  }
  console.log(orderDetails);
  console.log(orderItems);
  // place commas inside of order array and add the word "and", remove image url
  const itemNameArray = orderItems.map((item) => {
    return item[0];
  });

  const itemFullOptionsArray = orderItems.map((item) => {
    let itemColorSet = item[4].split("_");
    let itemColor = itemColorSet[0];
    let abbreviatedItem = `${item[0]} ($${Number(item[2]) / 100}, ${
      item[3]
    }, ${itemColor})`;
    return abbreviatedItem;
  });

  const itemOptionsString = itemFullOptionsArray.join("; ");

  const finalItemList = [];
  if (itemNameArray.length > 1) {
    const lastItem = itemNameArray.pop();
    console.log(lastItem);
    itemNameArray.push("and");
    itemNameArray.push(lastItem);
    let itemsString = itemNameArray.join(" ");
    finalItemList.push(itemsString);
  } else if (itemNameArray.length === 1) {
    finalItemList.push(itemNameArray[0]);
  }

  const cusIdDocument = await db
    .doc(`stripe_customers/${userID}`)
    .get()
    .then(async (document) => {
      console.log(document.data().address_shipping);
      const address_shipping = document.data().address_shipping;
      // trim address to only relevant bits.
      address_shipping.slice(3, 8);
      if (address_shipping[1] === null) {
        address_shipping.splice(1, 1);
      }

      const address_shipping_brief = [
        address_shipping[3],
        address_shipping[5],
        address_shipping[7],
        address_shipping[8],
      ];

      const lastAddressShipping = address_shipping_brief.join(" ");

      const receiverEmail = context.auth.token.email;

      const detailsArray = [orderDetails[0], orderDetails[1], orderDetails[2]];
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "jfalconmusik@gmail.com", // generated ethereal user
          pass: "bozxnfpjcaswiixq", // specific to this app
        },
      });

      // send mail with defined transport object
      let clientEmail = await transporter.sendMail({
        from: "<no-reply-jivas-originals@gmail.com>", // sender address
        to: receiptEmail ? receiptEmail.toString() : receiverEmail.toString(), // list of receivers
        subject: "Jiva's Originals Order Confirmation", // Subject line
        text: "newText", // plain text body
        html: `<h2>Jiva's Originals</h2>
                         <p>Your Order of <b>${finalItemList}</b> has been confirmed
                          for a total of <b>$${detailsArray[0]}</b> to your card ending in <b>****${detailsArray[1]}</b>.
                           It will be shipped to <b>${lastAddressShipping}</b>
                             Estimated arrival date is: <b>${detailsArray[2]}</b>.
                             Your Order Confirmation ID is <b>${orderString}</b>.
                              When your order ships, you will receive a follow-up email with your 
                              USPS tracking number.
                               </p>
                               <img
                                   width="300px"
                                  height="auto"
                                  src="https://firebasestorage.googleapis.com/v0/b/jiva-website-405ed.appspot.com/o/logo%20rose%20finished.svg?alt=media&token=d4f6fc6b-cec1-4832-adcb-440dae63563b" />
                               
                                  <h2>Jiva's Originals Return Policy</h2>
         
                               <p>Not in love with your purchase? That's okay. If you aren't satisfied,
                               neither are we. If your item has not yet shipped, you will receive
                               a full refund. If your order has shipped, but it's still within the 60 days of our return policy,
                               you can ship your items back free of charge. We will provide you
                               with either an exchange or store credit, whichever you prefer.</p>
                               <p>If you decide to return your items, please use the same packaging.
                                   A return slip and a shipping label will be included with your items.</p>
                               <p>If you have any questions or concerns regarding your return,
                               feel free to call or text (504)-616-6756 or email us at
                               <a href="mailto:jivasoriginals@gmail.com">jivasoriginals@gmail.com</a>. You can expect to hear back from us
                                   within 3 business days. </p>
                               <h2>Jiva's Originals LLC</h2>
                               `, // html body
      });

      let adminEmail = await transporter.sendMail({
        from: "<no-reply-jivas-originals@gmail.com>", // sender address
        to: "jfalconmusik@gmail.com", // list of receivers
        subject: "Jiva Admin Console", // Subject line
        text: "newText", // plain text body
        html: `<h3>
                     An order of ${itemOptionsString} has been confirmed
                      for a total of $${detailsArray[0]}.
                       Ship to ${lastAddressShipping}.
                       The orderID is ${orderString}.
                       The customer's user ID is ${userID}.
                         Expected arrival date is: ${detailsArray[2]}.
                           </h3>
                           <p>Customer's note: ${noteArr[0]}</p>
                           <br></br><br></br><br></br>
                           <h2>
                           Jiva's Originals LLC
                           </h2>`, // html body
      });
      return {
        adminEmail,
        clientEmail,
      };
    })

    .catch((error) => {
      console.log("error creating emails: " + error);
    });
  return cusIdDocument;
});

// Get order info from db - send timestamp, items, and amount paid:
exports.getUserOrders = functions.https.onCall((data, context) => {
  let userEmail = data.email;
  let userID = context.auth.uid;
  console.log(userEmail);
  // const userID = context.auth.uid
  const ordersQuery = db
    .collection(`/orders`)
    .where("order_data.userID", "==", userID);

  const ordersTotal = ordersQuery
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("no orders to report");
      }
      console.log(snapshot);
      // console.log(snapshot.data())
      const ordersArray = [];
      snapshot.forEach((order) => {
        console.log(order.data());
        console.log(order.id);
        let orderID = order.id;

        // let idArray = orderID.split("_")
        // let timeStamp = idArray[2]
        let timeStamp = order.data().order_data.created;
        let orderItems = order.data().order_data.items;
        let orderAmount = order.data().order_data.amount;
        let orderType = order.data().order_data.type;
        let creditUsed = order.data().order_data.storeCreditUsed;
        let uspsStatus = order.data().order_data.uspsStatus;
        let uspsTracking = order.data().order_data.uspsTracking;

        console.log(
          ` orderAmount: ${orderAmount} orderItems: ${orderItems} ${timeStamp}`
        );

        // console.log(newArray)
        // let newArray = [timeStamp, orderItems, orderAmount]

        return ordersArray.push([
          timeStamp,
          orderItems,
          orderAmount,
          orderType,
          creditUsed,
          uspsStatus,
          uspsTracking,
        ]);
      });
      console.log(ordersArray);

      return ordersArray.reverse();
    })
    .catch((error) => {
      console.log(error);
    });

  return ordersTotal;
  // console.log(ordersQuery)
});

exports.getPayMethod = functions.https.onCall((data, context) => {
  const userID = context.auth.uid;
  console.log(context.auth);
  console.log(userID);
  const cusIdDocument = db
    .doc(`stripe_customers/${userID}`)
    .get()
    .then((result) => {
      console.log(result);
      console.log(result.data);
      console.log(result.data().payMethod);
      // let payMethod = result.data().payMethod
      return result;
    });
  return cusIdDocument;
});

// No longer used:
exports.confirmCardPayment = functions.https.onCall(async (data, context) => {
  const cardElement = data.cardElement;
  const userID = context.auth.uid;
  const cusIdDocument = await db
    .doc(`stripe_customers/${userID}`)
    .get("customer_id");
  const cusPiDocRef = cusIdDocument.data().paymentIntent;
  const pendingIntent = await db.doc(`${cusPiDocRef}`).get();
  const client_secret = pendingIntent.data().client_secret;
  await stripe
    .confirmCardPayment(client_secret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: "Happy Consumer",
        },
      },
    })
    .then(async (result) => {
      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        return console.log(result.error.message);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === "succeeded") {
          await db
            .doc(`stripe_paymentsConfirmed/${result.paymentIntent.id}`)
            .set({
              ...result.paymentIntent,
            });
          await pendingIntent.delete();
          await cusIdDocument.update({
            paymentIntent: null,
            paymentsComplete: [
              ...paymentsComplete,
              `stripe_paymentsConfirmed/${result.paymentIntent.id}`,
            ],
          });

          let order_data = {
            items: "data.cart",
            ...result.paymentIntent,
          };

          // let timeStamp = result.paymentIntent.created
          // console.log(timeStamp)

          // let uidAndTime = `${userID}_${timeStamp}`
          await db.collection("orders").doc(uidAndTime).set({ order_data });
          return console.log("Order complete!");
        } else {
          return console.log("Payment status: " + result.paymentIntent.status);
        }
      }
    })
    .catch((error) => {
      return "error confirming card payment: " + error;
    });
  return console.log("All went as planned.");
});
// Handle result.error or result.paymentIntent

// Add a payment source (card) for a user by writing a stripe payment source token to Cloud Firestore
exports.addPaymentSource = functions.firestore
  .document("/stripe_customers/{userId}/tokens/{pushId}")
  .onCreate(async (snap, context) => {
    const source = snap.data();
    const token = source.token;
    if (source === null) {
      return null;
    }

    try {
      const snapshot = await admin
        .firestore()
        .collection("stripe_customers")
        .doc(context.params.userId)
        .get();
      const customer = snapshot.data().customer_id;
      const response = await stripe.customers.createSource(customer, {
        source: token,
      });
      return admin
        .firestore()
        .collection("stripe_customers")
        .doc(context.params.userId)
        .collection("sources")
        .doc(response.fingerprint)
        .set(response, { merge: true });
    } catch (error) {
      await snap.ref.set({ error: userFacingMessage(error) }, { merge: true });
      return reportError(error, { user: context.params.userId });
    }
  });

exports.addToWishlist = functions.https.onCall((data, context) => {
  const userID = context.auth.uid;
  console.log(data);
  const wishlistCache = data.wishlistCache;
  const wishlistDoc = db.doc(`wishlists/${userID}`);
  const queryWishList = wishlistDoc.get().then((doc) => {
    if (!doc.exists) {
      const document = wishlistDoc
        .create({ email: context.auth.token.email, items: [wishlistCache] })
        .then((result) => {
          return console.log(result);
        })
        .catch((error) => {
          return console.log(error);
        });
      return document;
    } else {
      const document = wishlistDoc.update({
        email: context.auth.token.email,
        items: admin.firestore.FieldValue.arrayUnion(wishlistCache),
      });
      console.log(doc.data());
      return document;
    }
  });
  return queryWishList;
});

exports.removeFromWishlist = functions.https.onCall((data, context) => {
  const userID = context.auth.uid;
  const wishlistItem = data.item;
  console.log(wishlistItem);
  const wishlistDoc = db.doc(`/wishlists/${userID}`);
  const result = wishlistDoc
    .get()
    .then((doc) => {
      const items = doc.data().items;
      const array = [...items];
      console.log(array);
      console.log("result: " + doc);
      console.log("items " + items);
      console.log("result.data " + doc.data());
      const newWishlist = array.filter((item) => !item.includes(wishlistItem));

      console.log(newWishlist);

      return wishlistDoc.update({
        items: [...newWishlist],
      });
    })
    .catch((error) => {
      return console.log("Error removing item from cart: " + error);
    });
  return result;
});

exports.addToCart = functions.https.onCall((data, context) => {
  const userID = context.auth.uid;
  console.log(data);
  const cartCache = data.cartCache;
  const cartDoc = db.doc(`/carts/${userID}`);
  console.log("cartDoc: " + cartDoc);
  const queryFunction = cartDoc
    .get()
    .then((doc) => {
      console.log(doc.data());
      console.log(doc.data().items);
      if (!doc.exists) {
        const document = cartDoc
          .create({ email: context.auth.token.email, items: [cartCache] })
          .then((result) => {
            return console.log("line 264: " + result);
          })
          .catch((error) => {
            return console.log(error);
          });
        return document;
      } else if (doc.exists && doc.data().items.includes(cartCache)) {
        const document = cartDoc.update({
          email: context.auth.token.email,
          items: [...doc.data().items, cartCache],
        });
        console.log(doc.data());
        console.log(doc);
        console.log(doc.data().items);
        return document;
      } else if (doc.exists && !doc.data().items.includes(cartCache)) {
        const document = cartDoc.update({
          email: context.auth.token.email,
          items: admin.firestore.FieldValue.arrayUnion(cartCache),
        });
        console.log("line 280: " + doc.data());
        return document;
      }
      return console.log(doc);
    })
    .catch((error) => {
      return console.log(error);
    });
  return queryFunction;
});

exports.removeFromCart = functions.https.onCall(async (data, context) => {
  const userID = context.auth.uid;
  const cartItem = data.cartCache;
  console.log(cartItem);
  const cartDoc = db.doc(`/carts/${userID}`);
  const result = await cartDoc
    .get()
    .then((doc) => {
      const items = doc.data().items;
      const array = [...items];
      console.log(array);
      console.log("result: " + doc);
      console.log("items " + items);
      console.log("result.data " + doc.data());
      const newCart = array.filter((item) => !item.includes(cartItem));

      const arrayOfGivenItem = array.filter((item) => item.includes(cartItem));

      arrayOfGivenItem.pop();

      if (arrayOfGivenItem.length > 0) {
        let finalCart = newCart.concat(arrayOfGivenItem);
        cartDoc.update({
          items: [...finalCart],
        });
        return console.log(finalCart);
      } else {
        cartDoc.update({
          items: [...newCart],
        });
        return console.log(newCart);
      }
    })
    .catch((error) => {
      return console.log("Error removing item from cart: " + error);
    });
  return console.log("cartItem: " + cartItem + " result of get: " + result);
});

exports.viewCart = functions.https.onCall(async (data, context) => {
  const userID = context.auth.uid;
  const cartDoc = db.doc(`carts/${userID}`);
  const result = cartDoc.get();
  return result;
});

exports.viewWishlist = functions.https.onCall((data, context) => {
  const userID = context.auth.uid;
  const wishlistDoc = db.doc(`wishlists/${userID}`);
  const result = wishlistDoc.get();
  return result;
});

exports.getUserAddress = functions.https.onCall(async (data, context) => {
  const userID = context.auth.uid;
  const stripeCustomer = db.doc(`stripe_customers/${userID}`).get();

  return stripeCustomer;
});

exports.getAllProducts = functions.https.onCall((data, context) => {
  const allProducts = db
    .collection(`products`)
    .get()
    .then((snapshot) => {
      const productsArr = [];
      snapshot.forEach((doc) => {
        productsArr.push(doc.data());
      });
      console.log(productsArr);
      return productsArr;
    })
    .catch((error) => {
      return console.log("error getting all products: " + error);
    });
  return allProducts;
});

// exports.getPrimaryPhotos = functions.https.onCall((data, context) => {

// /Users/jessefalconmusik/dev/jiva-react-again/jiva-react/src/SignInWithEmail.js

//   const allPhotos = db
//     .collection(`products`)
//     .get()
//     .then((snapshot) => {
//       const photosArr = [];
//       const productsArr = [];
//       snapshot.forEach((doc) => {
//         productsArr.push(doc.data());
//       });
//       console.log(productsArr);

//       productsArr.forEach((product) => photosArr.push(product.imageTrueUrl));
//       return photosArr;
//     })
//     .catch((error) => {
//       return console.log("error getting all products: " + error);
//     });
//   return allPhotos;
// });

exports.getProductData = functions.https.onCall(async (data, context) => {
  const item = data.value;
  const result = db
    .doc(`products/${item}`)
    .get()
    .then((document) => {
      const itemData = document.data();
      console.log(itemData);
      return itemData;
    })
    .catch((error) => {
      console.log("Error retrieving product data: " + error);
    });
  return result;
});

// When a user deletes their account, clean up after them
exports.cleanupUser = functions.auth.user().onDelete(async (user) => {
  const snapshot = await admin
    .firestore()
    .collection("stripe_customers")
    .doc(user.uid)
    .get();
  const customer = snapshot.data();
  let id = customer.id;
  await stripe.customers.del(customer.customer_id);
  return admin
    .firestore()
    .collection("stripe_customers")
    .doc(user.uid)
    .delete()
    .then(
      admin
        .firestore()
        .collection("stripe_paymentIntents")
        .where("customer", "==", id)
        .where("status", "!=", "succeeded")
        .delete()
    );
});

// To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// than simply relying on console.error. This will calculate users affected + send you email
// alerts, if you've opted into receiving them.
// [START reporterror]
function reportError(err, context = {}) {
  // This is the name of the StackDriver log stream that will receive the log
  // entry. This name can be any valid log stream name, but must contain "err"
  // in order for the error to be picked up by StackDriver Error Reporting.
  const logName = "errors";
  const log = logging.log(logName);

  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  const metadata = {
    resource: {
      type: "cloud_function",
      labels: { function_name: process.env.FUNCTION_NAME },
    },
  };

  // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
  const errorEvent = {
    message: err.stack,
    serviceContext: {
      service: process.env.FUNCTION_NAME,
      resourceType: "cloud_function",
    },
    context: context,
  };

  // Write the error log entry
  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), (error) => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}
// [END reporterror]

// Sanitize the error message for the user
function userFacingMessage(error) {
  return error.type
    ? error.message
    : "An error occurred, developers have been alerted";
}
