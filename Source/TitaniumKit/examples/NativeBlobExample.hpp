/**
 * Copyright (c) 2014 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License.
 * Please see the LICENSE included with this distribution for details.
 */

#ifndef _TITANIUM_EXAMPLES_NATIVEBLOBEXAMPLE_HPP_
#define _TITANIUM_EXAMPLES_NATIVEBLOBEXAMPLE_HPP_

#include "Titanium/Blob.hpp"

using namespace HAL;

/*!
 @class
 @discussion This is an example of how to implement Titanium::Blob
 for a native Blob.
 */
class NativeBlobExample final : public Titanium::Blob, public JSExport<NativeBlobExample>
{
public:
	NativeBlobExample(const JSContext&) TITANIUM_NOEXCEPT;

	virtual ~NativeBlobExample() = default;
	NativeBlobExample(const NativeBlobExample&) = default;
	NativeBlobExample& operator=(const NativeBlobExample&) = default;
#ifdef TITANIUM_MOVE_CTOR_AND_ASSIGN_DEFAULT_ENABLE
	NativeBlobExample(NativeBlobExample&&) = default;
	NativeBlobExample& operator=(NativeBlobExample&&) = default;
#endif

	static void JSExportInitialize();

	virtual unsigned get_length() const TITANIUM_NOEXCEPT override;
	virtual unsigned get_height() const TITANIUM_NOEXCEPT override;
	virtual std::string get_mimeType() const TITANIUM_NOEXCEPT override;
	virtual std::string get_nativePath() const TITANIUM_NOEXCEPT override;
	virtual unsigned get_size() const TITANIUM_NOEXCEPT override;
	virtual std::string get_text() const TITANIUM_NOEXCEPT override;
	virtual unsigned get_width() const TITANIUM_NOEXCEPT override;
	virtual void append(const std::shared_ptr<Blob>&) TITANIUM_NOEXCEPT override;

protected:
};

#endif  // _TITANIUM_EXAMPLES_NATIVEBLOBEXAMPLE_HPP_
