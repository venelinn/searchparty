import React from "react";
import { Band } from "./Band";

export default {
  title: "Components/Band",
  component: Band,
};

export const BandStory = {
	render: args => <Band {...args} />,
	args: {
		heading: "sample",
		items: "sample",
	},
	argTypes: {
    heading: {
      options: ["none", "sample"],
      mapping: {
        none: undefined,
        sample: {
          heading: "Our values",
          as: "h2",
          size: "h2",
          uppercase: true,
          animationId: "heading-values",
        },
      },
      control: {
        type: "radio",
      },
    },
   	items: {
			options: ["none", "sample"],
			mapping: {
				none: null,
				sample: [
					{
							"id":"5mlq1aIK5EP25mDaAPu54I",
							"type":"gridItem",
							"locale":"en",
							"title":"Entrepreneur",
							"heading":{
								"id":"1cNYt14VQjiliyV0X5XrQQ",
								"type":"heading",
								"locale":"en",
								"title":"Entrepreneurial",
								"heading":"Entrepreneurial",
								"as":"h3",
								"size":"h3"
							},
							"content":"Bold in our thinking and fearless in our decisions, we are empowered to seize opportunities and deliver results.",
							"image":{
								"id":"2ny2Dl46L1zTjrBpBYq9vy",
								"type":"cloudinaryAsset",
								"locale":"en",
								"title":"Entrepreneur",
								"alt":"Entrepreneur",
								"image":[
										{
											"id":"sunwing_vacations_group/Epic images/entrepreneurial",
											"type":"image",
											"src":"https://res.cloudinary.com/dtnwfag6s/image/upload/f_auto/q_auto/v1692885651/sunwing_vacations_group/Epic%20images/entrepreneurial.jpg",
											"alt":"",
											"locale":0,
											"width":4472,
											"height":6708
										}
								]
							}
					},
					{
							"id":"62s9vSWxuFrW9PMFzhUcoc",
							"type":"gridItem",
							"locale":"en",
							"title":"Passionate",
							"heading":{
								"id":"4po8fK3EI9qY23a1DnXfz4",
								"type":"heading",
								"locale":"en",
								"title":"Passionate",
								"heading":"Passionate",
								"as":"h3",
								"size":"h3"
							},
							"content":"Proud of our business, we are inspired to share our best with each other and our customers.",
							"image":{
								"id":"4bEwAqGTNlPExbC5MqYL5g",
								"type":"cloudinaryAsset",
								"locale":"en",
								"title":"Passionate",
								"alt":"Passionate",
								"image":[
										{
											"id":"sunwing_vacations_group/Epic images/passionate",
											"type":"image",
											"src":"https://res.cloudinary.com/dtnwfag6s/image/upload/f_auto/q_auto/v1692885627/sunwing_vacations_group/Epic%20images/passionate.jpg",
											"alt":"",
											"locale":0,
											"width":4104,
											"height":2736
										}
								]
							}
					},
					{
							"id":"21oluDkyfKVAZwN8N4WQcZ",
							"type":"gridItem",
							"locale":"en",
							"title":"Innovative",
							"heading":{
								"id":"M3uje2D79HXP3UDxYZJ9j",
								"type":"heading",
								"locale":"en",
								"title":"Innovative",
								"heading":"Innovative",
								"as":"h3",
								"size":"h3"
							},
							"content":"We challenge conventional thinking and never stop looking for ways to improve ourselves and our customer experience.",
							"image":{
								"id":"6qkNNvLd7ocqaaF23e07YY",
								"type":"cloudinaryAsset",
								"locale":"en",
								"title":"Innovative",
								"alt":"Innovative",
								"image":[
										{
											"id":"sunwing_vacations_group/Epic images/innovative",
											"type":"image",
											"src":"https://res.cloudinary.com/dtnwfag6s/image/upload/f_auto/q_auto/v1692885722/sunwing_vacations_group/Epic%20images/innovative.jpg",
											"alt":"",
											"locale":0,
											"width":6000,
											"height":4000
										}
								]
							}
					},
					{
							"id":"6dnZ7ga6eOWe0AnCHPYco7",
							"type":"gridItem",
							"locale":"en",
							"title":"Customer-centric",
							"heading":{
								"id":"3CEDkKz2L8VW9L2mpfYUIP",
								"type":"heading",
								"locale":"en",
								"title":"Customer-centric",
								"heading":"Customer-centric",
								"as":"h3",
								"size":"h3"
							},
							"content":"We think of our customer in all that we do to add real value and deliver on our Purpose.",
							"image":{
								"id":"1wnac1YpJLkPzNVeZFKIWN",
								"type":"cloudinaryAsset",
								"locale":"en",
								"title":"Customer-centric",
								"alt":"Customer-centric",
								"image":[
										{
											"id":"sunwing_vacations_group/Epic images/customer_centric",
											"type":"image",
											"src":"https://res.cloudinary.com/dtnwfag6s/image/upload/f_auto/q_auto/v1692885639/sunwing_vacations_group/Epic%20images/customer_centric.jpg",
											"alt":"",
											"locale":0,
											"width":4176,
											"height":2495
										}
								]
							}
					}
				],
			},
			control: {
				type: "radio",
			},
		},
  },
};
