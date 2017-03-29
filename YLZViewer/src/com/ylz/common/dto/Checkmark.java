package com.ylz.common.dto;

public class Checkmark {
	private boolean enabled;
	private String text;
	public Checkmark(){}
	public boolean isEnabled() {
		return enabled;
	}
	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
}
