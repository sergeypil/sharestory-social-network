package org.sharestory.project.exceptions;

public class SpringSharestoryException extends RuntimeException {
    public SpringSharestoryException(String exMessage, Exception exception) {
        super(exMessage, exception);
    }

    public SpringSharestoryException(String exMessage) {
        super(exMessage);
    }
}
