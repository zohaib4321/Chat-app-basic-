import {ChatState} from "../context/ChatProvider";
import ScrollableFeed from 'react-scrollable-feed'
import { Avatar, Tooltip } from "@chakra-ui/react";
import { 
    isSameUser,
    isSameSenderMargin, 
    isSameSender, 
    isLastMessage 
} from "../config/ChatLogics";


export default function ScrollableChats({messages}) {
	const {user} = ChatState()

	return (
		<ScrollableFeed>
			{messages && messages.map((message, i) => {
					return <div style={{ display: "flex" }} key={message._id}>
						{(isSameSender(messages, message, i, user._id) ||
							isLastMessage(messages, i, user._id)) && (
							<Tooltip
								label={message.sender.username}
								placement="bottom-start"
								hasArrow
							>
								<Avatar
									mt="7px"
									mr={1}
									size="sm"
									cursor="pointer"
									name={message.sender.username}
									src={message.sender.pic}
								/>
							</Tooltip>
						)}
						<span
							style={{
								backgroundColor: `${
									message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
								}`,
								marginLeft: isSameSenderMargin(messages, message, i, user._id),
								marginTop: isSameUser(messages, message, i, user._id) ? 3 : 10,
								borderRadius: "20px",
								padding: "5px 15px",
								maxWidth: "75%",
							}}
						>
							{message.content}
						</span>
					</div>;
				})
			}
		</ScrollableFeed>
	);
}
