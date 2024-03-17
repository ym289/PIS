package com.sptc.pis.websocket;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TextMessageDto{

	private String message;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}